import { useState, useEffect } from 'react';
import { Button, Tabs, message } from 'antd';
import CssIcon from '@mui/icons-material/Css';
import HtmlIcon from '@mui/icons-material/Html';
import JavascriptIcon from '@mui/icons-material/Javascript';
import { observer } from 'mobx-react-lite';
import request from '../../service/fetch';
import { useStore } from '../../store';
import styles from './index.module.scss';
interface ITag {
  id: string;
  title: string;
  icon: string;
  followUsers: [];
  tagArticles: [];
}

const Tag = () => {
  const store = useStore();

  const [followTags, setFollowTags] = useState<ITag[]>();
  const [allTags, setAllTags] = useState<ITag[]>();
  const [loading, setLoading] = useState(false);

  const { userId } = store?.user?.userInfo;

  useEffect(() => {
    request.post('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        const { followTags = [], allTags = [] } = res?.data;
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    });
  }, [loading]);

  const handleTagIcon = (iconType: string) => {
    switch (iconType) {
      case 'CssIcon':
        return <CssIcon className={styles.icon} />;
      case 'HtmlIcon':
        return <HtmlIcon className={styles.icon} />;
      case 'JavascriptIcon':
        return <JavascriptIcon className={styles.icon} />;
    }
  };

  const handleUnFollow = (tagId: string) => {
    setLoading(true);
    request
      .post('/api/tag/follow', {
        tagId,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('已取消關注');
          setLoading(false);
        } else {
          message.error(res?.msg || '取消關注失敗');
          setLoading(false);
        }
      });
  };

  const handleFollow = (tagId: string) => {
    setLoading(true);
    request
      .post('/api/tag/follow', {
        tagId,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('關注成功');
          setLoading(false);
        } else {
          message.error(res?.msg || '關注失敗');
          setLoading(false);
        }
      });
  };

  const handleTagsMapping = (tagType: ITag[] | undefined) => {
    return tagType?.map((tag: any) => (
      <div className={styles.tagWrapper} key={tag?._id}>
        <div>{handleTagIcon(tag?.icon)}</div>
        <div className={styles.title}>{tag?.title}</div>
        <div>
          {tag?.followUsers.length} 關注 {tag?.tagArticles.length} 文章
        </div>
        {tag?.followUsers?.includes(userId) ? (
          <Button loading={loading} onClick={() => handleUnFollow(tag?._id)}>
            已關注
          </Button>
        ) : (
          <Button
            loading={loading}
            type='primary'
            onClick={() => handleFollow(tag?._id)}
          >
            關注
          </Button>
        )}
      </div>
    ));
  };

  return (
    <div className='content-layout'>
      <Tabs
        items={[
          {
            label: '已關注標籤',
            key: 'follow',
            children: (
              <div className={styles.tags}>{handleTagsMapping(followTags)}</div>
            ),
          },
          {
            label: '全部標籤',
            key: 'all',
            children: (
              <div className={styles.tags}>{handleTagsMapping(allTags)}</div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default observer(Tag);

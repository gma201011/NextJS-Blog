import { useState } from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { connectToDatabase } from '../../lib/db';
import { Avatar, Input, Button, message, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { IArticle } from '../../components/ArticleList';
import styles from './index.module.scss';
import request from '../../service/fetch';
import { ObjectId } from 'mongodb';

interface IComment {
  _id: string;
  content: string;
  updateTime: string;
  userId: string;
  articleId: string;
  userNickname: string;
}

export interface IProps {
  article: IArticle;
  comments: IComment[];
}

export async function getServerSideProps({ params }: { params: any }) {
  const articleId = params?.id;
  const client = await connectToDatabase();
  const articleCollection = client.db().collection('articles');
  const article = await articleCollection.findOne({
    _id: new ObjectId(articleId),
  });
  const commentCollection = client.db().collection('comments');
  const comments = await commentCollection
    .find({ articleId })
    .sort({ updateTime: -1 })
    .toArray();
  client.close();
  if (article) {
    await articleCollection.updateOne(
      { articleId },
      { $set: { view: +article.view + 1 } }
    );
  }
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      comments: JSON.parse(JSON.stringify(comments)),
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const { article, comments } = props;
  const { nickname, _id, title, updateTime, view, content, userId } = article;

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageComments, setPageComments] = useState<any>(comments || []);

  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;

  const handleCommentButtonOnClick = () => {
    setLoading(true);
    request
      .post('/api/comment/publish', {
        articleId: _id,
        content: inputValue,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('發表成功');
          const newComment = [
            {
              _id: Math.random(),
              updateTime: new Date(),
              content: inputValue,
              userId: loginUserInfo.userId,
              articleId: _id,
              userNickname: loginUserInfo.nickname,
            },
          ].concat([...pageComments]);
          setPageComments(newComment);
          setInputValue('');
          setLoading(false);
        } else {
          setLoading(false);
          message.error('發表失敗');
        }
      });
  };

  return (
    <div>
      <div className='content-layout'>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.user}>
          <Avatar icon={<UserOutlined />} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>{format(new Date(updateTime), 'yyyy-MM-dd hh-mm-ss')}</div>
              <div>閱讀次數：{view}</div>
              {loginUserInfo?.userId === userId && (
                <Link href={`/editor/${_id}`}>編輯</Link>
              )}
            </div>
          </div>
        </div>
        <Markdown className={styles.markdown}>{content}</Markdown>
      </div>
      <div className={styles.divider}></div>
      <div className='content-layout'>
        <div className={styles.comment}>
          <h3>評論</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar icon={<UserOutlined />} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder='請輸入評論'
                  rows={4}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                  loading={loading}
                  type='primary'
                  onClick={handleCommentButtonOnClick}
                >
                  發表評論
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {pageComments?.map((comment: IComment) => (
              <div className={styles.wrapper} key={comment?._id}>
                <Avatar icon={<UserOutlined />} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.userNickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.updateTime),
                        'yyyy-MM-dd hh-mm-ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleDetail);

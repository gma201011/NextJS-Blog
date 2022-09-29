import Link from 'next/link';
import styles from './index.module.scss';
import { formatDistanceToNow } from 'date-fns';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { markdownToTxt } from 'markdown-to-txt';

export interface IArticle {
  _id: string;
  content: string;
  title: string;
  nickname: string;
  email: string;
  updateTime: string;
  view: number;
  userId: string;
}

export interface IProps {
  article: IArticle;
}

const ArticleList = (props: IProps) => {
  const { article } = props;
  const { nickname, updateTime, title, content, view } = article;
  return (
    <Link href={`article/${article._id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{nickname}</span>
            <span className={styles.updateTime}>
              {formatDistanceToNow(new Date(updateTime))}
            </span>
          </div>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.content}>{markdownToTxt(content)}</p>
          <div className={styles.count}>
            <EyeOutlined />
            &ensp;{view}
          </div>
        </div>
        <Avatar icon={<UserOutlined />} size={48} />
      </div>
    </Link>
  );
};

export default ArticleList;

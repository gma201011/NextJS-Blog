import Link from 'next/link';
import styles from './index.module.scss';
import { Button, Avatar, Divider } from 'antd';
import {
  CodeOutlined,
  FireOutlined,
  UserOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import ArticleList from '../../components/ArticleList';
import { observer } from 'mobx-react-lite';
import { connectToDatabase } from '../../lib/db';
import { IArticle } from '../../components/ArticleList';

export type IUserInfo = {
  nickname: string;
  email: string;
  userId: string;
  introduce: string;
  job: string;
};
interface IProps {
  userInfo: IUserInfo;
  userArticles: IArticle[];
}

export async function getServerSideProps({ params }: { params: any }) {
  const userId = params?.id;
  const client = await connectToDatabase();

  const userCollection = client.db().collection('users');
  const userInfo = await userCollection.findOne({ userId });

  const articleCollection = client.db().collection('articles');
  const userArticles = await articleCollection.find({ userId }).toArray();

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(userInfo)),
      userArticles: JSON.parse(JSON.stringify(userArticles)),
    },
  };
}
const UserDetail = (props: IProps) => {
  const { userInfo, userArticles } = props;
  const viewCount = userArticles?.reduce(
    (prev: number, next: IArticle) => prev + +next?.view,
    0
  );
  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} size={90} icon={<UserOutlined />} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined /> {userInfo.introduce}
            </div>
          </div>
          <Link href='/user/profile'>
            <Button>編輯個人資料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {userArticles?.map((article) => (
            <div key={article?._id}>
              <ArticleList article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>個人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共創作 {userArticles?.length} 篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被閱讀 {viewCount} 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(UserDetail);

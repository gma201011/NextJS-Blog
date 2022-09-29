import React, { useState, useEffect } from 'react';
import { connectToDatabase } from '../lib/db';
import request from '../service/fetch';
import ArticleList from '../components/ArticleList';
import { Divider, Spin } from 'antd';
import { IArticle } from '../components/ArticleList';
import styles from './index.module.scss';
import classnames from 'classnames';

export interface ITag {
  _id: string;
  icon: string;
  title: string;
  followUsers: [];
  tagArticles: [];
}

export interface IProps {
  articles: IArticle[];
  tags: [];
}

export async function getServerSideProps() {
  const client = await connectToDatabase();

  const articleCollection = client.db().collection('articles');
  const articles = await articleCollection
    .find()
    .sort({ updateTime: -1 })
    .toArray();

  const tagsCollection = client.db().collection('tags');
  const tags = await tagsCollection.find().toArray();

  const allTag = {
    _id: 'all',
    title: 'all',
  };

  const resultTags = [allTag, ...tags];

  client.close();

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(resultTags)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles, tags } = props;

  const [selectTag, setSelectTag] = useState<string | undefined>('all');
  const [displayArticles, setDisplayArticles] = useState([...articles]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    request
      .get(
        selectTag === 'all'
          ? '/api/article/get'
          : `/api/article/get?tag_id=${selectTag}`
      )
      .then((res: any) => {
        if (res?.code === 0) {
          setDisplayArticles(res?.data);
        }
        setFetching(false);
      });
  }, [selectTag]);

  const handleTagOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event?.target as HTMLElement;
    const { tagId } = element.dataset;
    setSelectTag(tagId);
  };

  return (
    <div>
      <div className={styles.tags} onClick={handleTagOnClick}>
        {tags?.map((tag: ITag) => (
          <div
            key={tag._id}
            data-tag-id={tag._id}
            className={classnames(
              styles.tag,
              selectTag === tag?._id ? styles['active'] : ''
            )}
          >
            {tag.title}
          </div>
        ))}
      </div>
      <Spin spinning={fetching} size='large'>
        <div className='content-layout'>
          {displayArticles.map((article: any) => (
            <div key={article._id}>
              <ArticleList article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default Home;

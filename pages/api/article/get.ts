import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { options } from '../../../config';
import { ObjectId } from "mongodb";


async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tag_id = '' } = req?.query || {};
  const client = await connectToDatabase();
  const articleCollections = client.db().collection("articles");
  const tagCollection = client.db().collection("tags");

  if (tag_id) {
    // @ts-ignore
    const tagInfo = await tagCollection.findOne({_id: new ObjectId(tag_id)});
    const articlesArr = tagInfo?.tagArticles;
    const sortedArticles = await articleCollections.find({_id: { $in: articlesArr }}).toArray();
    res.status(200).json({ code: 0, msg: 'ok', data: sortedArticles || [] });
  } else {
    const allArticles = await articleCollections.find().toArray();
    res.status(200).json({ code: 0, msg: 'ok', data: allArticles || [] });
  }

  client.close();
}

export default withIronSessionApiRoute(getHandler, options);
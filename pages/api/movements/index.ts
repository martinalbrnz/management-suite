import type { NextApiRequest, NextApiResponse } from "next";

import { ApiResponse } from "../../../constants/customTypes";
import dbConnect from "../../../lib/db";
import Movement from "../../../models/movement";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return await getMovements(req, res);
  }
  if (req.method === 'POST') {
    return await addMovement(req, res);
  }
}

const getMovements = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    const data = await Movement.find().populate('account', { _id: 0, name: 1 });

    if (data.length === 0) {
      return res
        .status(201)
        .json({
          msg: 'No data found',
          data: [],
          error: false,
        });
    }

    return res
      .status(200)
      .json({
        msg: 'Fetched data',
        data: data,
        error: false
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        msg: 'There has been an error!',
        data: error,
        error: true
      });
  }
}

const addMovement = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  try {
    console.log('Connecting to mongodb');
    await dbConnect();
    console.log('Connected to mongodb');

    const movement = new Movement({
      date: req.body.date,
      amount: req.body.amount,
      account: req.body.account,
      description: req.body.description,
      isDeleted: req.body.isDeleted
    });
    console.log(movement);
    const data = await movement.save();

    return res
      .status(201)
      .json({
        msg: 'Movement created',
        data,
        error: false
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        msg: 'There has been an error!',
        data: error,
        error: true
      });
  }
}

export default handler;

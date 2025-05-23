import { Request, Response } from 'express';
import { Account, IAccount } from '../models/account';
import { Transfer } from '../models/transfer';

// 获取所有账户
export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: '获取账户列表失败' });
  }
};

// 获取单个账户
export const getAccountById = async (req: Request, res: Response) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: '账户不存在' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: '获取账户信息失败' });
  }
};

// 创建账户
export const createAccount = async (req: Request, res: Response) => {
  try {
    const account = new Account(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: '创建账户失败' });
  }
};

// 更新账户
export const updateAccount = async (req: Request, res: Response) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!account) {
      return res.status(404).json({ message: '账户不存在' });
    }
    res.json(account);
  } catch (error) {
    res.status(400).json({ message: '更新账户失败' });
  }
};

// 删除账户
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const account = await Account.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ message: '账户不存在' });
    }
    res.json({ message: '账户已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除账户失败' });
  }
};

// 账户间转账
export const transfer = async (req: Request, res: Response) => {
  const { fromAccountId, toAccountId, amount, remark } = req.body;

  try {
    // 开始事务
    const session = await Account.startSession();
    session.startTransaction();

    try {
      // 检查源账户
      const fromAccount = await Account.findById(fromAccountId).session(session);
      if (!fromAccount) {
        throw new Error('源账户不存在');
      }
      if (fromAccount.balance < amount) {
        throw new Error('账户余额不足');
      }

      // 检查目标账户
      const toAccount = await Account.findById(toAccountId).session(session);
      if (!toAccount) {
        throw new Error('目标账户不存在');
      }

      // 更新账户余额
      fromAccount.balance -= amount;
      toAccount.balance += amount;

      await fromAccount.save({ session });
      await toAccount.save({ session });

      // 创建转账记录
      const transfer = new Transfer({
        fromAccount: fromAccountId,
        toAccount: toAccountId,
        amount,
        remark
      });
      await transfer.save({ session });

      // 提交事务
      await session.commitTransaction();
      session.endSession();

      res.json({ message: '转账成功' });
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      session.endSession();
      console.error('转账失败:', error);
      const errorMessage = error instanceof Error ? error.message : '转账失败';
      res.status(400).json({ message: errorMessage });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '转账失败';
    res.status(400).json({ message: errorMessage });
  }
};

// 调整账户余额
export const adjustBalance = async (req: Request, res: Response) => {
  const { amount, remark } = req.body;

  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: '账户不存在' });
    }

    // 更新账户余额
    account.balance += amount;
    await account.save();

    // 创建转账记录（用于记录余额调整）
    const transfer = new Transfer({
      fromAccount: amount < 0 ? account._id : null,
      toAccount: amount > 0 ? account._id : null,
      amount: Math.abs(amount),
      remark: remark || (amount > 0 ? '余额增加' : '余额减少')
    });
    await transfer.save();

    res.json(account);
  } catch (error) {
    res.status(400).json({ message: '调整余额失败' });
  }
}; 
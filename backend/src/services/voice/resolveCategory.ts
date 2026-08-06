import { Types } from 'mongoose';
import { Category } from '../../models/category';
import { UserCategory } from '../../models/user-category';

export async function resolveExpenseCategoryId(
  userId: string,
  roomNumber: string,
  categoryName: string
): Promise<string | null> {
  const disabledPermissions = await UserCategory.find({
    userId: new Types.ObjectId(userId),
    isDisabled: true,
  });
  const disabledCategoryIds = new Set(
    disabledPermissions.map((permission) => permission.categoryId.toString())
  );

  const systemCategory = await Category.findOne({
    isSystem: true,
    type: 'expense',
    name: categoryName,
  });

  if (systemCategory && !disabledCategoryIds.has(systemCategory._id.toString())) {
    return systemCategory._id.toString();
  }

  const customCategory = await Category.findOne({
    isSystem: false,
    type: 'expense',
    roomNumber,
    name: categoryName,
  });

  if (customCategory) {
    return customCategory._id.toString();
  }

  if (categoryName !== '其他') {
    return resolveExpenseCategoryId(userId, roomNumber, '其他');
  }

  return systemCategory?._id.toString() || null;
}

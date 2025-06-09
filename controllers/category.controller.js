import db from "../libs/db.js";

//create a category


export async function createCategory(req, res, next) {
  const { name, description } = req.body;

  //check if the category already exists
  const existingCategory = await db.category.findUnique({
    where: { name },
    
  });
    if (existingCategory) {
        const error = new Error('Category already exists');
      error.status = 400;
      throw error;
        
    }

  try {
    const category = await db.category.create({
      data: {
        name,
        description,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data:category,
    });
  } catch (error) {
    next(error);
  }
}

//get all categories
export async function getAllCategories(req, res, next) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
        include: {
            courses:true,
            },
        
    });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}
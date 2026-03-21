  // const foodModel = require("../models").food;
  // const {predictionFood} = require("../services/gemini.service");

  // exports.createFood = async (request, result) => {
  //   try {
  //     const userId = request.user.id;
  //     const {food_category_id, food_name, initial_weight, unit_of_weight, storage_location, purchase_date, price } = request.body;

  //     if (!food_name || !initial_weight || !unit_of_weight || !storage_location || !purchase_date) {
  //       return result.status(400).json({
  //         success: false,
  //         message: "All required fields must be filled"
  //       });
  //     }

  //     const prediksiAI = await predictionFood({food_name, storage_location, purchase_date, initial_weight, unit_of_weight});
  //     let expiryDate = null;

  //     if (prediksiAI.expiry_date) {
  //       expiryDate = new Date(prediksiAI.expiry_date);
  //       if (isNaN(expiryDate.getTime())) {
  //         expiryDate = null;
  //       }
  //     }

  //     if (!expiryDate) {
  //       const purchase = new Date(purchase_date);
  //       expiryDate = new Date(purchase);
  //       expiryDate.setDate(purchase.getDate() + (prediksiAI.shelf_life_days || 3));
  //     }

  //     let priceOfUnit = null;
  //     if (price && initial_weight && initial_weight !== 0) {
  //       priceOfUnit = price / initial_weight;
  //     }

  //     const today = new Date();
  //     let status = "fresh";
  //     const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  //     if (diffDays <= 0) {
  //       status = "expired";
  //     } else if (diffDays <= 3) {
  //       status = "warning";
  //     }
      
  //     const newFood = await foodModel.create({
  //       userId: userId,
  //       foodCategoryId: food_category_id,
  //       foodName: food_name,
  //       initialWeight: initial_weight,
  //       currentWeight: initial_weight,
  //       unitOfWeight: unit_of_weight,
  //       storageLocation: storage_location,
  //       purchaseDate: purchase_date,
  //       expiryDate: expiryDate,
  //       price: price,
  //       priceOfUnit: priceOfUnit,
  //       status: status
  //     });

  //     return result.status(201).json({
  //       success: true,
  //       message: "Food created successfully",
  //       data: newFood
  //     });
  //   } catch (error) {
  //     return result.status(500).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // };
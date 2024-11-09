var db = require("../config/connection");
var collections = require("../config/collections");
var bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;

module.exports = {


  addChatMessage: (chatData) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.CHATS_COLLECTION)
        .insertOne(chatData)
        .then((data) => {
          resolve(data.insertedId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getChatMessagesByAdminAndUser: (adminId, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const chats = await db.get()
          .collection(collections.CHATS_COLLECTION)
          .find({
            $or: [
              { adminId: objectId(adminId), userId: objectId(userId) },
              { adminId: objectId(userId), userId: objectId(adminId) }
            ]
          })
          .sort({ timestamp: 1 }) // Sort by timestamp to display messages in order
          .toArray();

        resolve(chats);
      } catch (error) {
        reject(error);
      }
    });
  },

  getAllAdmins: () => {
    return new Promise(async (resolve, reject) => {
      let admins = await db
        .get()
        .collection(collections.ADMIN_COLLECTION)
        .find()
        .toArray();
      resolve(admins);
    });
  },


  getAllChatsById: (expertId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const chats = await db
          .get()
          .collection(collections.CHATS_COLLECTION)
          .aggregate([
            { $match: { expertId: objectId(expertId), isUser: true } }, // Filter by expertId and isUser = true
            { $sort: { timestamp: -1 } }, // Sort by timestamp to get the latest messages first
            {
              $group: {
                _id: "$userId", // Group by userId to get unique users
                latestChat: { $first: "$$ROOT" } // Take the first (latest) chat message for each user
              }
            },
            { $replaceRoot: { newRoot: "$latestChat" } } // Replace root with the latest chat document
          ])
          .toArray();

        resolve(chats);
      } catch (error) {
        reject(error);
      }
    });
  },


  getAllChatsByIdAdmin: (adminId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const chats = await db
          .get()
          .collection(collections.CHATS_COLLECTION)
          .aggregate([
            { $match: { adminId: objectId(adminId), isUser: true } }, // Filter by adminId and isUser = true
            { $sort: { timestamp: -1 } }, // Sort by timestamp to get the latest messages first
            {
              $group: {
                _id: "$userId", // Group by userId to get unique users
                latestChat: { $first: "$$ROOT" } // Take the first (latest) chat message for each user
              }
            },
            { $replaceRoot: { newRoot: "$latestChat" } } // Replace root with the latest chat document
          ])
          .toArray();

        resolve(chats);
      } catch (error) {
        reject(error);
      }
    });
  },

  ///////ADD dataset/////////////////////                                         
  adddataset: (dataset, callback) => {
    console.log(dataset);
    dataset.Price = parseInt(dataset.Price);
    db.get()
      .collection(collections.DATASET_COLLECTION)
      .insertOne(dataset)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL dataset/////////////////////                                            
  getAlldatasets: () => {
    return new Promise(async (resolve, reject) => {
      let datasets = await db
        .get()
        .collection(collections.DATASET_COLLECTION)
        .find()
        .toArray();
      resolve(datasets);
    });
  },

  getAllcontents: () => {
    return new Promise(async (resolve, reject) => {
      let contents = await db
        .get()
        .collection(collections.CONTENT_COLLECTION)
        .find()
        .toArray();
      resolve(contents);
    });
  },

  getDatasetById: (datasetId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DATASET_COLLECTION)
        .findOne({ _id: objectId(datasetId) })
        .then((dataset) => {
          resolve(dataset);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getContentById: (contentId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.CONTENT_COLLECTION)
        .findOne({ _id: objectId(contentId) })
        .then((content) => {
          resolve(content);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  ///////ADD dataset DETAILS/////////////////////                                            
  getdatasetDetails: (datasetId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DATASET_COLLECTION)
        .findOne({
          _id: objectId(datasetId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE dataset/////////////////////                                            
  deletedataset: (datasetId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DATASET_COLLECTION)
        .removeOne({
          _id: objectId(datasetId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE dataset/////////////////////                                            
  updatedataset: (datasetId, datasetDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DATASET_COLLECTION)
        .updateOne(
          {
            _id: objectId(datasetId)
          },
          {
            $set: {
              Name: datasetDetails.Name,
              Category: datasetDetails.Category,
              Price: datasetDetails.Price,
              Description: datasetDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL dataset/////////////////////                                            
  deleteAlldatasets: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.DATASET_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  ///////ADD expert/////////////////////                                         
  addexpert: (expert, callback) => {
    console.log(expert);
    expert.Price = parseInt(expert.Price);
    db.get()
      .collection(collections.EXPERT_COLLECTION)
      .insertOne(expert)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL expert/////////////////////                                            
  getAllexperts: () => {
    return new Promise(async (resolve, reject) => {
      let experts = await db
        .get()
        .collection(collections.EXPERT_COLLECTION)
        .find()
        .toArray();
      resolve(experts);
    });
  },

  ///////ADD expert DETAILS/////////////////////                                            
  getexpertDetails: (expertId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.EXPERT_COLLECTION)
        .findOne({
          _id: objectId(expertId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE expert/////////////////////                                            
  deleteexpert: (expertId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.EXPERT_COLLECTION)
        .removeOne({
          _id: objectId(expertId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE expert/////////////////////                                            
  updateexpert: (expertId, expertDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.EXPERT_COLLECTION)
        .updateOne(
          {
            _id: objectId(expertId)
          },
          {
            $set: {
              Name: expertDetails.Name,
              Category: expertDetails.Category,
              Price: expertDetails.Price,
              Description: expertDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL expert/////////////////////                                            
  deleteAllexperts: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.EXPERT_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },


  addProduct: (product, callback) => {
    console.log(product);
    product.Price = parseInt(product.Price);
    db.get()
      .collection(collections.PRODUCTS_COLLECTION)
      .insertOne(product)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.PRODUCTS_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },

  doSignup: (adminData) => {
    return new Promise(async (resolve, reject) => {
      if (adminData.Code == "admin123") {
        adminData.Password = await bcrypt.hash(adminData.Password, 10);
        db.get()
          .collection(collections.ADMIN_COLLECTION)
          .insertOne(adminData)
          .then((data) => {
            resolve(data.ops[0]);
          });
      } else {
        resolve({ status: false });
      }
    });
  },

  doSignin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let admin = await db
        .get()
        .collection(collections.ADMIN_COLLECTION)
        .findOne({ Email: adminData.Email });
      if (admin) {
        bcrypt.compare(adminData.Password, admin.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },

  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .findOne({ _id: objectId(productId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  deleteProduct: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .removeOne({ _id: objectId(productId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  updateProduct: (productId, productDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .updateOne(
          { _id: objectId(productId) },
          {
            $set: {
              Name: productDetails.Name,
              Category: productDetails.Category,
              Price: productDetails.Price,
              Description: productDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },

  deleteAllProducts: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .find()
        .toArray();
      resolve(users);
    });
  },

  removeUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .removeOne({ _id: objectId(userId) })
        .then(() => {
          resolve();
        });
    });
  },

  removeAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collections.ORDER_COLLECTION)
        .find()
        .toArray();
      resolve(orders);
    });
  },

  changeStatus: (status, orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              "orderObject.status": status,
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .removeOne({ _id: objectId(orderId) })
        .then(() => {
          resolve();
        });
    });
  },

  cancelAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  searchProduct: (details) => {
    console.log(details);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .createIndex({ Name: "text" }).then(async () => {
          let result = await db
            .get()
            .collection(collections.PRODUCTS_COLLECTION)
            .find({
              $text: {
                $search: details.search,
              },
            })
            .toArray();
          resolve(result);
        })

    });
  },
};

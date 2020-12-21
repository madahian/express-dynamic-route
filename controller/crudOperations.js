const baseService = require('../service/baseService');

module.exports = {
  getList: async (req, res, next) => {
    let data = {
      routerData: req.routerData,
      tableName: req.routerData.basePath,
    };
    const mdlRes = await baseService.find(req, data);
    res.status(200).json({
      status: 'success',
      results: mdlRes.results,
      cols: req.routerData.cols,
      data: mdlRes.data,
    });
  },
  getItem: async (req, res, next) => {
    let data = {
      routerData: req.routerData,
      tableName: req.routerData.basePath,
      fields: { id: req.params.id },
    };
    data.id = req.params.id;
    const result = await baseService.first(data);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  },
  putItem: async (req, res, next) => {
    let data = {
      id: req.params.id,
      tableName: req.routerData.basePath,
      fields: req.body,
    };
    data.fields._createdBy = req.jwt.id;
    data.fields._modifiedBy = req.jwt.id;

    await baseService.update(data);
    res.status(200).json({
      status: 'success',
      message: 'Successfully updated!',
    });
  },
  postItem: async (req, res, next) => {
    let data = {
      tableName: req.routerData.basePath,
      fields: req.body,
    };
    data.fields._createdBy = req.jwt.id;
    data.fields._modifiedBy = req.jwt.id;
    let mdlRes = await baseService.insert(data);
    res.status(200).json({
      status: 'success',
      id: mdlRes[0],
      message: 'Inserted successfully!',
    });
  },
  deleteItem: async (req, res, next) => {
    let data = {
      tableName: req.routerData.basePath,
      fields: {
        id: req.params.id,
      },
    };
    await baseService.delete(data);
    res.status(204).json({
      status: 'success',
      message: 'Deleted successfully!',
    });
  },
};

const db = wx.cloud.database();
export const onAdd = function (dataName, params) {
  db.collection(dataName).add({
    data: params,
    success: result => {
      result.code = 0;
      console.log(result)
      return result;
    },
    fail: err => {
      err.code = 1;
      err.msg = '[数据库] [新增记录] 失败！';
      return err;
    }
  })
}

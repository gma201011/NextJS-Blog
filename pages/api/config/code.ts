export const EXCEPTION_USER = {
  NOT_LOGIN: {
    code: 1001,
    msg: '請先登入'
  },
  NOT_FOUND: {
    code: 1002,
    msg: '找不到該使用者'
  }
}

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '發布文章失敗'
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: '更新文章失敗'
  },
  NOT_FOUND: {
    code: 2003,
    msg: '未找到文章'
  }
}

export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 3001,
    msg: '發布評論失敗'
  },
}
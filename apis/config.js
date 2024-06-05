const MODAL_TYPE_ENUM = {
  CONTENT_GENERATE: "CONTENT_GENERATE",
  CONTENT_CENSOR: "CONTENT_CENSOR",
};

const config = {
  [MODAL_TYPE_ENUM.CONTENT_GENERATE]: {
    name: "AIGC_MODAL_fansletter",
    client_id: "ObhaWbvDfiNkA2epTjlHzl0O",
    client_secret: "GZhPAREpGeFeb8fkBhiRZ0GAkARFPua7",
    apiContentType: "body",
  },
  [MODAL_TYPE_ENUM.CONTENT_CENSOR]: {
    name: "Content_Check_AIGC",
    client_id: "4bckev0TV20YGFtUxwVuK6QX",
    client_secret: "btzZxUxlXSFlOHuTkLFNIBGiLH6wJFmd",
    strategyId: 36252,
    apiContentType: "form",
  },
};

module.exports = { MODAL_TYPE_ENUM, config };

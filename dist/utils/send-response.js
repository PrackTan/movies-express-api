const sendResponse = (res, result) => {
    const response = Object.assign({}, result);
    const code = response === null || response === void 0 ? void 0 : response.code;
    res.status(code).json(response);
};
export default sendResponse;

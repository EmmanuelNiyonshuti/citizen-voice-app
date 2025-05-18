import ApiError from "../utils/apiError.js";

const notFound = (req, res, next) => {
    throw new ApiError(404, `Can't find ${req.originalUrl} on the server`);
}

export default notFound;

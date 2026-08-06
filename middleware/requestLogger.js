const hideSensitiveData = (data) => {
  if (!data || typeof data !== "object") return data;

  const copy = Array.isArray(data) ? [...data] : { ...data };

  ["password", "oldPassword", "newPassword", "token"].forEach((key) => {
    if (copy[key]) copy[key] = "***hidden***";
  });

  return copy;
};

const requestLogger = (req, res, next) => {
  const startedAt = Date.now();
  const originalJson = res.json.bind(res);

  console.log("\n========== API REQUEST ==========");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  console.log("Payload:", hideSensitiveData(req.body));

  res.json = (body) => {
    console.log("---------- API RESPONSE ----------");
    console.log("Status:", res.statusCode);
    console.log("Response:", hideSensitiveData(body));
    console.log("Time:", `${Date.now() - startedAt}ms`);
    console.log("=================================\n");

    return originalJson(body);
  };

  next();
};

module.exports = requestLogger;
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const maxWidth = getRouterParam(event, 'maxWidth');
  const body = await readMultipartFormData(event);
  const data = utils.parseMultipartData(body);
  const processConfig = {
    width: Number(maxWidth) || 1200,
    uploadDir: id,
  };
  const processed: {
    [key: string]: any;
  } = {};

  for (const key of Object.keys(data)) {
    processed[key] = Array.isArray(data[key])
      ? await Promise.all(
          data[key].map(async (file) => ({
            filename: file.filename,
            data: await optimizeAndSaveImages(file.data, processConfig),
          })),
        )
      : {
          filename: data[key].filename,
          data: await optimizeAndSaveImages(data[key].data, processConfig),
        };
  }

  return processed;
});

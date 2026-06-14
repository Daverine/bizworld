export default defineEventHandler(async (event) => {
  const { upload_dir, image_width } = getQuery(event);
  const data = await parseMultipartData(event);

  const processed: Record<string, { filename: string; data: string }[]> = {};

  for (const key of Object.keys(data)) {
    processed[key] = await Promise.all(
      data[key].map(async (file: { filename: string; data: Buffer; type?: string }) => ({
        filename: file.filename,
        data: file.type?.startsWith("image/")
          ? await saveToStorage({
              data: await optimizeImages(file.data, {
                width: Number(image_width) || 1200,
              }),
              uploadDir: upload_dir as string,
              extension: ".webp",
            })
          : await saveToStorage({
              data: file.data,
              uploadDir: upload_dir as string,
              extension: file.type?.split("/")[1] ? `.${file.type.split("/")[1]}` : undefined,
            }),
      })),
    );
  }
  return processed;
});

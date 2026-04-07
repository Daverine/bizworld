export const utils = {
  getUniqueId(nameSpace: string = 'unique-id'): string {
    return `${nameSpace}${Date.now()}${Math.floor(Math.random() * 10000)}`;
  },
  async slugFromTitle(body: any, pool: any): Promise<string> {
    let baseSlug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    let slug = `${baseSlug}@${body.businessId}`;
    let counter = 1;

    while (true) {
      const result = await pool.query(
        'SELECT id FROM products WHERE slug = $1 AND business_id = $2',
        [slug, body.businessId],
      );
      if (result.rows.length === 0) break;
      slug = `${baseSlug}-${counter++}@${body.businessId}`;
    }

    return slug;
  },
  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  },
  afterNextRepaint(func?: () => void) {
    return new Promise((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (func) func();
          resolve('void');
        }),
      ),
    );
  },
  parseMultipartData(data: any[] | undefined): { [key: string]: any } {
    const parsedData: { [key: string]: any } = {};
    data?.forEach((el: any) => {
      let key = el.name as string;
      let value = el.filename ? { filename: el.filename, data: el.data } : el.data;
      if (parsedData[key] && Array.isArray(parsedData[key])) {
        parsedData[key].push(value);
      } else {
        parsedData[key] = data.filter((item: any) => item.name === key).length > 1
          ? [value]
          : value;
      }
    });
    return parsedData;
  },
  compareArrays: (a: any[], b: any[]): boolean =>
    a.length === b.length && a.every((element, index) => element === b[index]),
  durationInMilliseconds: (duration: string): number =>
    parseFloat(duration) * (duration.includes('ms') ? 1 : 1000),
  fileToURL: (file: File) => URL.createObjectURL(file),
};

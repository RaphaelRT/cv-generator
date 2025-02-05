import { IncomingForm } from 'formidable';

export const parseForm = async (req: Request): Promise<{ fields: any; files: any }> => {
  const form = new IncomingForm({ keepExtensions: true });

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

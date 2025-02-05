import express, { Application, json, urlencoded } from 'express';
import fileUpload from 'express-fileupload';
import processRoute from './routes/process';
import offerRoutes from "./routes/offer";
import path from "path";

const app: Application = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/api/process', processRoute);
app.use('/output', express.static(path.join(__dirname, '../output')));
app.use("/offers", offerRoutes);

export default app;

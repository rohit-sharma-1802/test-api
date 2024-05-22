import express from 'express';
import axios from 'axios';
import { client } from '@gradio/client';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setTimeout(5 * 60 * 1000, () => {
    console.log('Request has timed out.');
    res.status(408).send('Request timed out');
  });
  next();
});

app.get('/process-images', async (req, res) => {
  try {
    // Fetching example images
    const response_0 = await axios.get("https://levihsu-ootdiffusion.hf.space/--replicas/6urx6/file=/tmp/gradio/2e0cca23e744c036b3905c4b6167371632942e1c/model_1.png", { responseType: 'blob' });
    if (response_0.status !== 200) {
      console.error(`Failed to fetch image 1: ${response_0.status} - ${response_0.statusText}`);
      throw new Error(`Failed to fetch image 1: ${response_0.statusText}`);
    }
    const exampleImage_0 = response_0.data;

    const response_1 = await axios.get("https://levihsu-ootdiffusion.hf.space/--replicas/6urx6/file=/tmp/gradio/180d4e2a1139071a8685a5edee7ab24bcf1639f5/03244_00.jpg", { responseType: 'blob' });
    if (response_1.status !== 200) {
      console.error(`Failed to fetch image 2: ${response_1.status} - ${response_1.statusText}`);
      throw new Error(`Failed to fetch image 2: ${response_1.statusText}`);
    }
    const exampleImage_1 = response_1.data;

    // Initialize Gradio client
    const gradioApp = await client("https://levihsu-ootdiffusion.hf.space/--replicas/6urx6/");
    
    // Call predict method
    const result = await gradioApp.predict("/process_dc", [
      exampleImage_0,  // blob in 'Model' Image component
      exampleImage_1,  // blob in 'Garment' Image component
      "Upper-body",    // string in 'Garment category (important option!!!)' Dropdown component
      1,               // number (numeric value between 1 and 4) in 'Images' Slider component
      20,              // number (numeric value between 20 and 40) in 'Steps' Slider component
      1,               // number (numeric value between 1.0 and 5.0) in 'Guidance scale' Slider component
      -1,              // number (numeric value between -1 and 2147483647) in 'Seed' Slider component
    ]);

    res.json(result.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

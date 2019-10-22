/* eslint-disable no-console */
import cluster from 'cluster';

import { app } from '../server/app.mjs';

process.env.NODE_ENV = 'production';
process.env.PUBLIC_URL = process.env.PUBLIC_URL || '';

const PORT = process.env.PORT || 3000;


  app.listen(PORT, err => {
    if (err) {
      return console.error(err);
    }

    console.info(
      `Server running on port ${PORT}`
    );
  });


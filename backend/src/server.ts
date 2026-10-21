import app from './app';
import config from './config';

async function bootstrap() {
  try {
    const server = app.listen(config.port, () => {
      console.log(`🚀 Student Submission Portal Backend running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log('Server closed gracefully.');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error: unknown) => {
      console.error('Unexpected error detected:', error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();


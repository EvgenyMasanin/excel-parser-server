import { AtGuard } from './common/guards/at.guard'
import { AppModule } from './app.module'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getConnection } from 'typeorm'

async function start() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Test backend')
    .setDescription('Documentation REST API')
    .setVersion('1.0.0')
    .addTag('Test API')
    .build()

  app.enableCors()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  const reflector = new Reflector()
  app.useGlobalGuards(new AtGuard(reflector))
  console.log(
    '🚀 ~ start ~ getConnection().entityMetadatas',
    getConnection().entityMetadatas.map((entity) => entity.name)
  )

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

start()

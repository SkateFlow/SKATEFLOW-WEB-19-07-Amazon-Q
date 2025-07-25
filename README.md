# SkateFlow Web

Aplicativo web responsivo para a comunidade de skate, com seções para eventos, artigos, mapas de pistas e área administrativa.

## Estrutura do Projeto

O projeto foi organizado seguindo as melhores práticas de desenvolvimento React:

- `/src/assets`: Arquivos estáticos como imagens
- `/src/components`: Componentes reutilizáveis da UI
- `/src/context`: Contextos React para gerenciamento de estado
- `/src/hooks`: Hooks personalizados
- `/src/layouts`: Layouts de página
- `/src/pages`: Componentes de página
- `/src/services`: Serviços para comunicação com a API
- `/src/utils`: Funções utilitárias e constantes

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_NAME=SkateFlow
```

## Scripts Disponíveis

No diretório do projeto, você pode executar:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run build:prod`

Builds the app for production with additional optimizations:
- Desativa a geração de sourcemaps para maior segurança
- Otimiza o tamanho do bundle

Use este comando para builds de produção.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

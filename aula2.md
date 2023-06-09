# Aula: Tanto faz o nome das pastas, o que importa são padrões e convenções.

## Processos de Softwares no mundo real

### Usuário
> Twitter
- Clicamos num botão "Tweet"
- Abriu um Modal com a caixa para digitarmos um Tweet
- Digitei meu tweet, para que o botão de envio fosse liberado
- Cliquei para enviar
- Aparecer uma mensagem de "Publicado com sucesso"

### Trabalho das pessoas Devs por tras
#### Front End
- Programar a tela
    - HTML, CSS (Visual da tela)
- Ter o comportamento de escutar toda vez que o usuário digite
    - Validar se tiver mais de 1 caracter, remove o atributo disabled
- Adicionar um evento que escuta quando o botão de tweetar foi apertado
    - Pegar o conteúdo do Tweet
    - Mandar para o servidor

#### Back End
- Vamos receber as indos do tweet no Body da Request
- **Validar** se o tweet é um tweet válido
    Se não for válido, retorna um erro
- Salvar o tweet no banco de dados
    Se não for possível, retorna um erro
- Retornar a mensagem de sucesso


### O que é comum nesses processos?
[View]
- HTML e CSS
- Repostas do backend
[Controller]
- Executar funções de validação, vamos garantir que os dados estão corretos
- Enviar para a parte que "salva"
[Repository]
- Responsável por PEGAR dados e ENVIAR dados

##### Código de exemplo [FRONT]

```html
<script>
  const tweetRepository {
    getTweets() {},
    postTweet() {}
  }
  function tweetController() {
    const $input = document.getElementById('input');
    // Fail Fast validations
    if(!isTweetValid($input.value)) return;
    const tweet = $input;
    // daqui em diante, podemos confiar que TEMOS os dados que precisamos
    tweetRepository.postTweet(tweet);
    alert("Tweet publicado com sucesso!")
  }
</script>
<form>
  <input type="text" id="input" />
  <button type="button" onclick="tweetController()">Tweetar</button>
</form>
```

###### [BACK]
[controller] -> Recebe o dado do **INPUT** 
[repository] -> Onde fica a lógica de acesso ao banco de dados
  - Responsável por PEGAR dados e por ENVIAR dados

```js
  const tweetRepository {
    getTweets() {},
    postTweet() {}
  }
  function tweetController(request, response) {
    // fail fast validations
    if(!isTweetValid(request.body)) return response.status(400).send('Invalid tweet');
    const tweet = $input;
    // daqui em diante, podemos confiar que TEMOS os dados que precisamos
    tweetRepository.postTweet(tweet);
    return response.status(200).send('Tweet posted');
  }
```

## Resumo
- Isso tudo faz link com a aula anterior de `Input -> Processamento -> Output`
- `Input (Usuário, FrontEnd, Serviço) -> Processamento (Controller, Repository) -> Output (Response, View)`
    - CRUDs

- Model
    - Representação do dado/abstração
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output, env } from "node:process";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({ apiKey: env.OPEN_API_KEY });
const openai = new OpenAIApi(configuration);
const readline = createInterface({ input, output });

const chatbotType = 'I would like to pass you a sequence of letters and I want you to return the top 3 scoring words you can make from the input. You should base this score on official UK scrabble rules. You do not need to use all characters. For each answer I would like to you to return the score followed by a brief description of the word'

const messages = [{ role: "system", content: chatbotType }];
let userInput = await readline.question("Hi, Welcome to Scrabble Shakedown. What letters ya got?\n\n");

while (userInput !== ".exit") {
  messages.push({ role: "user", content: userInput });
  try {
    const response = await openai.createChatCompletion({
      messages,
      model: "gpt-3.5-turbo",
    });

    const botMessage = response.data.choices[0].message;
    if (botMessage) {
      messages.push(botMessage);
      userInput = await readline.question("\n" + botMessage.content + "\n\n");
    } else {
      userInput = await readline.question("\nNo response, try asking again\n");
    }
  } catch (error) {
    console.log(error.message);
    userInput = await readline.question("\nSomething went wrong, try asking again\n");
  }
}

readline.close();
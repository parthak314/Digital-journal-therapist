import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { JournalEntry } from './use-journal';

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "Llama-3.3-70B-Instruct";

export async function generateLlamaResponse(prompt: string): Promise<string> {
  try {
    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token!),
    );

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { 
            role: "system", 
            content: "You are a thoughtful journaling assistant. Generate meaningful, introspective prompts that encourage self-reflection and personal growth." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 1000,
        model: modelName
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    return response.body.choices[0].message.content;
  } catch (error) {
    console.error('Error generating Llama response:', error);
    throw error;
  }
}

export async function semanticSearch(query: string, entries: JournalEntry[]) {
  try {
    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token!),
    );

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that finds relevant journal entries based on semantic meaning. Return only the IDs of relevant entries, separated by commas."
          },
          {
            role: "user",
            content: `Find relevant entries from this list that match the query: "${query}"\n\nEntries:\n${entries.map(entry => `ID: ${entry.id}\nContent: ${entry.content}\n---`).join('\n')}`
          }
        ],
        temperature: 0.2,
        top_p: 1.0,
        max_tokens: 1000,
        model: modelName
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    const relevantIds = response.body.choices[0].message.content.split(',').map(id => id.trim());
    return entries.filter(entry => relevantIds.includes(entry.id));
  } catch (error) {
    console.error('Error in semantic search:', error);
    return [];
  }
} 
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const companies = [
  { name: "OpenAI", website: "https://openai.com" },
  { name: "Google", website: "https://google.com" },
  { name: "Anthropic", website: "https://anthropic.com" },
  { name: "DeepSeek", website: "https://deepseek.com" },
  { name: "OpenCode", website: "https://opencode.ai" },
];

const modelsByCompany: Record<string, { name: string; slug: string }[]> = {
  OpenAI: [
    { name: "GPT-4o", slug: "gpt-4o" },
    { name: "GPT-4o Mini", slug: "gpt-4o-mini" },
    { name: "GPT-4 Turbo", slug: "gpt-4-turbo" },
    { name: "GPT-3.5 Turbo", slug: "gpt-3.5-turbo" },
    { name: "O1", slug: "o1" },
    { name: "O1 Mini", slug: "o1-mini" },
    { name: "O1 Preview", slug: "o1-preview" },
    { name: "O3", slug: "o3" },
    { name: "O3 Mini", slug: "o3-mini" },
    { name: "GPT-4.5", slug: "gpt-4.5" },
  ],
  Google: [
    { name: "Gemini 2.0 Flash", slug: "gemini-2-0-flash" },
    { name: "Gemini 2.0 Flash Lite", slug: "gemini-2-0-flash-lite" },
    { name: "Gemini 1.5 Pro", slug: "gemini-1-5-pro" },
    { name: "Gemini 1.5 Flash", slug: "gemini-1-5-flash" },
    { name: "Gemini 1.5 Flash 8B", slug: "gemini-1-5-flash-8b" },
    { name: "Gemini Pro", slug: "gemini-pro" },
    { name: "Gemini Pro Vision", slug: "gemini-pro-vision" },
    { name: "Gemini Ultra", slug: "gemini-ultra" },
    { name: "Gemini Nano", slug: "gemini-nano" },
    { name: "Gemini 2.5", slug: "gemini-2-5" },
  ],
  Anthropic: [
    { name: "Claude Sonnet 4", slug: "claude-sonnet-4" },
    { name: "Claude Opus 4", slug: "claude-opus-4" },
    { name: "Claude 3 Opus", slug: "claude-3-opus" },
    { name: "Claude 3 Sonnet", slug: "claude-3-sonnet" },
    { name: "Claude 3 Haiku", slug: "claude-3-haiku" },
    { name: "Claude 3.5 Sonnet", slug: "claude-3-5-sonnet" },
    { name: "Claude 3.5 Haiku", slug: "claude-3-5-haiku" },
    { name: "Claude 2.1", slug: "claude-2-1" },
    { name: "Claude 2.0", slug: "claude-2-0" },
    { name: "Claude Instant", slug: "claude-instant" },
  ],
  DeepSeek: [
    { name: "DeepSeek Chat", slug: "deepseek-chat" },
    { name: "DeepSeek Coder", slug: "deepseek-coder" },
    { name: "DeepSeek Pro", slug: "deepseek-pro" },
    { name: "DeepSeek Math", slug: "deepseek-math" },
    { name: "DeepSeek VL", slug: "deepseek-vl" },
    { name: "DeepSeek V2", slug: "deepseek-v2" },
    { name: "DeepSeek V2.5", slug: "deepseek-v2-5" },
    { name: "DeepSeek V3", slug: "deepseek-v3" },
    { name: "DeepSeek R1", slug: "deepseek-r1" },
    { name: "DeepSeek Context", slug: "deepseek-context" },
  ],
  OpenCode: [
    { name: "OpenCode 4o", slug: "opencode-4o" },
    { name: "OpenCode 4o Mini", slug: "opencode-4o-mini" },
    { name: "OpenCode O1", slug: "opencode-o1" },
    { name: "OpenCode O1 Mini", slug: "opencode-o1-mini" },
    { name: "OpenCode Sonnet", slug: "opencode-sonnet" },
    { name: "OpenCode Haiku", slug: "opencode-haiku" },
    { name: "OpenCode Flash", slug: "opencode-flash" },
    { name: "OpenCode Pro", slug: "opencode-pro" },
    { name: "OpenCode Ultra", slug: "opencode-ultra" },
    { name: "OpenCode Preview", slug: "opencode-preview" },
  ],
};

async function seed() {
  console.log("Truncating tables...");
  await prisma.modelProviderMapping.deleteMany();
  await prisma.model.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.company.deleteMany();

  console.log("Seeding companies...");
  const companyRecords = await prisma.company.createManyAndReturn({ data: companies });

  console.log("Seeding providers...");
  const providerRecords = await prisma.provider.createManyAndReturn({
    data: companies,
  });

  console.log("Seeding models...");
  for (const company of companyRecords) {
    const models = modelsByCompany[company.name];
    if (models) {
      await prisma.model.createMany({
        data: models.map((m) => ({ ...m, companyId: company.id })),
      });
    }
  }

  console.log("Seeding model-provider mappings...");
  const allModels = await prisma.model.findMany();
  const allProviders = await prisma.provider.findMany();

  const mappings = [];
  for (const model of allModels) {
    for (const provider of allProviders) {
      mappings.push({
        modelId: model.id,
        providerId: provider.id,
        inputTokenCost: Math.floor(Math.random() * 10 + 1) * 100,
        outputTokenCost: Math.floor(Math.random() * 10 + 1) * 200,
      });
    }
  }
  await prisma.modelProviderMapping.createMany({ data: mappings });

  console.log("Seeding complete!");
  console.log(`Companies: ${companyRecords.length}, Providers: ${providerRecords.length}, Models: ${allModels.length}, Mappings: ${mappings.length}`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
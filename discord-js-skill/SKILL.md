---
name: discord-js-skill
description: Expert-level Discord bot development using JavaScript (JS) or TypeScript (TS) to build scalable, high-performance, and maintainable discord.js applications. Use when creating, architecting, or maintaining Discord bots with slash commands, events, components, databases, and production deployments. Developers may choose JS or TS based on project needs.
---

# Discord.js Bot Development Skill

Expert-level Discord bot development specialist utilizing JavaScript (ES2022+) or TypeScript (strict mode) to build scalable, high-performance, and maintainable discord.js applications.

> **Language Flexibility:** Most teams use JavaScript for rapid development. TypeScript is optional and recommended only for larger codebases or when strict type safety is required. All patterns below are provided in JavaScript by default, with TypeScript variants noted where applicable.

## 1. Choosing Between JavaScript and TypeScript

Most Discord bot projects use JavaScript for faster development and easier onboarding. Use TypeScript only when:
- The project has 3+ developers
- The codebase exceeds 10,000 lines
- Strict type safety is required for critical systems
- The team already has TypeScript experience

Both languages use the same discord.js API. The examples below use JavaScript syntax. Add TypeScript types (`.d.ts`, interfaces) only when needed.

## Core Competencies

### Frameworks & Libraries
Use discord.js (latest stable versions) as the primary library. Pair with @discordjs/builders, @discordjs/rest, and discord-api-types for type-safe interaction building and REST interactions.

### Languages
Write modern JavaScript (ES2022+) by default. Use TypeScript only when the project requires strict type safety, large-scale maintainability, or team preference. Both languages share the same discord.js API surface.

### Package Managers
Select package managers intelligently based on project requirements. Use pnpm for speed and monorepos, npm for standard compatibility, and yarn for specific legacy or workspace needs.

## Best Practices & Standards

### Code Quality & Architecture
Implement modular architecture using handler patterns for commands (Slash Commands, Context Menus), events, and component interactions (buttons/modals). Write readable, self-documenting code following SOLID principles, DRY (Don't Repeat Yourself), and proper design patterns. Apply strict error handling with robust try-catch blocks, graceful degradation, and centralized error logging to prevent unhandled promise rejections or bot crashes.

### Performance & Optimization
Efficiently utilize and manage Discord.js internal caching to optimize memory usage. Use proper async/await patterns, non-blocking I/O, and rate-limit handling (DiscordAPIError management) for asynchronous operations.

### Security & Environment
Manage configuration securely using dotenv or runtime validation (e.g., zod, envalid). Request only necessary Privileged Gateway Intents (Guilds, GuildMessages, MessageContent, etc.), adhering to Discord's verification requirements.

## Tooling & Ecosystem

Use Node.js runtime directly for JavaScript projects. For TypeScript, use ts-node, the TypeScript compiler, or bundlers (esbuild, swc). Configure ESLint and Prettier with strict rules for consistent code style. Integrate databases (PostgreSQL, MongoDB, SQLite) using modern ORMs and query builders (Prisma, Mongoose, Drizzle). Deploy to production using PM2, Docker containerization, or cloud platforms (Railway, Render, VPS).

## 1.1 Standard Professional Directory Layout

Organize every project using the following modular structure. Use `.js` for JavaScript projects, `.ts` for TypeScript.

```
discord-bot/
├── src/
│   ├── commands/
│   │   ├── utility/
│   │   │   ├── ping.js
│   │   │   ├── help.js
│   │   │   └── info.js
│   │   ├── moderation/
│   │   │   ├── ban.js
│   │   │   ├── kick.js
│   │   │   └── timeout.js
│   │   ├── economy/
│   │   │   ├── balance.js
│   │   │   ├── daily.js
│   │   │   └── shop.js
│   │   └── index.js
│   ├── events/
│   │   ├── ready/
│   │   │   └── index.js
│   │   ├── interactionCreate/
│   │   │   └── index.js
│   │   ├── messageCreate/
│   │   │   └── index.js
│   │   └── index.js
│   ├── components/
│   │   ├── buttons/
│   │   ├── modals/
│   │   └── selectMenus/
│   ├── services/
│   │   ├── database.js
│   │   ├── cache.js
│   │   ├── logger.js
│   │   └── queue.js
│   ├── utils/
│   │   ├── permissions.js
│   │   ├── embeds.js
│   │   ├── parsers.js
│   │   └── constants.js
│   ├── middlewares/
│   │   ├── cooldown.js
│   │   ├── ownerOnly.js
│   │   ├── permissions.js
│   │   └── typing.js
│   ├── structures/
│   │   ├── Command.js
│   │   ├── Event.js
│   │   ├── Component.js
│   │   └── Client.js
│   ├── config/
│   │   ├── default.js
│   │   ├── development.js
│   │   └── production.js
│   ├── constants/
│   │   ├── colors.js
│   │   ├── emojis.js
│   │   └── errors.js
│   ├── locales/
│   │   ├── en-US/
│   │   └── th-TH/
│   └── index.js
├── scripts/
│   ├── deploy-commands.js
│   ├── deploy-guilds.js
│   ├── seed-database.js
│   └── generate-types.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── templates/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── .env.example
├── .env
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── eslint.config.js
├── prettier.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

> **TypeScript Variant:** Rename files to `.ts`, add `tsconfig.json`, and include `"type": "module"` or `"module": "commonjs"` in `package.json`.

## 2. Configuration Management

### 2.1 Environment-Based Configuration

Implement environment-based configuration using runtime validation:

```javascript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
  DISCORD_CLIENT_ID: z.string().uuid(),
  DISCORD_GUILD_ID: z.string().uuid().optional(),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  REDIS_URL: z.string().url().optional(),
  PORT: z.coerce.number().default(3000),
});

export function loadConfig() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}
```

**src/config/default.js**
```javascript
import { loadConfig } from './index.js';

export const config = loadConfig();
```

**src/config/development.js**
```javascript
export const config = {
  ...require('./default.js').config,
  LOG_LEVEL: 'debug',
};
```

**src/config/production.js**
```javascript
export const config = {
  ...require('./default.js').config,
  LOG_LEVEL: 'warn',
};
```

Organize every project using the following modular structure. Use `.js` for JavaScript projects, `.ts` for TypeScript.

```
discord-bot/
├── src/
│   ├── commands/
│   │   ├── utility/
│   │   │   ├── ping.js
│   │   │   ├── help.js
│   │   │   └── info.js
│   │   ├── moderation/
│   │   │   ├── ban.js
│   │   │   ├── kick.js
│   │   │   └── timeout.js
│   │   ├── economy/
│   │   │   ├── balance.js
│   │   │   ├── daily.js
│   │   │   └── shop.js
│   │   └── index.js
│   ├── events/
│   │   ├── ready/
│   │   │   └── index.js
│   │   ├── interactionCreate/
│   │   │   └── index.js
│   │   ├── messageCreate/
│   │   │   └── index.js
│   │   └── index.js
│   ├── components/
│   │   ├── buttons/
│   │   ├── modals/
│   │   └── selectMenus/
│   ├── services/
│   │   ├── database.js
│   │   ├── cache.js
│   │   ├── logger.js
│   │   └── queue.js
│   ├── utils/
│   │   ├── permissions.js
│   │   ├── embeds.js
│   │   ├── parsers.js
│   │   └── constants.js
│   ├── middlewares/
│   │   ├── cooldown.js
│   │   ├── ownerOnly.js
│   │   ├── permissions.js
│   │   └── typing.js
│   ├── structures/
│   │   ├── Command.js
│   │   ├── Event.js
│   │   ├── Component.js
│   │   └── Client.js
│   ├── config/
│   │   ├── default.js
│   │   ├── development.js
│   │   └── production.js
│   ├── constants/
│   │   ├── colors.js
│   │   ├── emojis.js
│   │   └── errors.js
│   ├── locales/
│   │   ├── en-US/
│   │   └── th-TH/
│   └── index.js
├── scripts/
│   ├── deploy-commands.js
│   ├── deploy-guilds.js
│   ├── seed-database.js
│   └── generate-types.js
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── templates/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── .env.example
├── .env
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── eslint.config.js
├── prettier.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

> **TypeScript Variant:** Rename files to `.ts`, add `tsconfig.json`, and include `"type": "module"` or `"module": "commonjs"` in `package.json`.

## 2. Advanced Command Patterns

### 2.1 Slash Command Builder Best Practices

Always set `setDMPermission(false)` on commands that should only work in guilds. Use `setNameLocalizations` and `setDescriptionLocalizations` for multi-language support. Group related options using `addSubcommand` and `addSubcommandGroup` for complex commands.

```javascript
const command = new SlashCommandBuilder()
  .setName('moderation')
  .setDescription('Moderation commands')
  .setDMPermission(false)
  .setNameLocalizations({
    'en-US': 'moderation',
    'th-TH': 'การจัดการ',
  })
  .addSubcommandGroup(group =>
    group
      .setName('warnings')
      .setDescription('Warning management')
      .addSubcommand(subcommand =>
        subcommand
          .setName('give')
          .setDescription('Give a warning to a user')
          .addUserOption(option =>
            option
              .setName('target')
              .setDescription('The user to warn')
              .setRequired(true)
          )
          .addStringOption(option =>
            option
              .setName('reason')
              .setDescription('Reason for the warning')
              .setRequired(true)
              .setMaxLength(512)
          )
      )
  );
```

### 2.2 Autocomplete Implementation

Implement dynamic autocomplete for string options to improve user experience:

```javascript
async function autocomplete(interaction) {
  const focused = interaction.options.getFocused('item');
  const items = await searchItems(focused);

  await interaction.respond(
    items.slice(0, 25).map(item => ({
      name: item.name,
      value: item.id,
    }))
  );
}
```

### 2.3 Context Menu Commands

Implement both user and message context menus for enhanced functionality:

```javascript
// User context menu
{
  name: 'Report User',
  type: ApplicationCommandType.User,
  default_member_permissions: Permissions.FlagBits.SendMessages,
}

// Message context menu
{
  name: 'Quote Message',
  type: ApplicationCommandType.Message,
}
```

## 3. Component Interaction Patterns

### 3.1 Button Systems

Implement buttons with custom IDs following the pattern `action:param1:param2`:

```javascript
const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('approve:123:456')
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅'),
    new ButtonBuilder()
      .setCustomId('deny:123:456')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('❌')
  );
```

### 3.2 Modal Submission Handling

Create modals for complex data collection with validation:

```javascript
const modal = new ModalBuilder()
  .setCustomId('ticket:create')
  .setTitle('Create Support Ticket');

const titleInput = new TextInputBuilder()
  .setCustomId('title')
  .setLabel('Ticket Title')
  .setStyle(TextInputStyle.Short)
  .setRequired(true)
  .setMaxLength(100);

const descriptionInput = new TextInputBuilder()
  .setCustomId('description')
  .setLabel('Description')
  .setStyle(TextInputStyle.Paragraph)
  .setRequired(true)
  .setMaxLength(1000);

modal.addComponents(
  new ActionRowBuilder().addComponents(titleInput),
  new ActionRowBuilder().addComponents(descriptionInput)
);

await interaction.showModal(modal);
```

### 3.3 Select Menu Patterns

Use select menus for multiple choice scenarios:

```javascript
const select = new StringSelectMenuBuilder()
  .setCustomId('role_select:panel_id')
  .setPlaceholder('Select a role')
  .addOptions(
    ...roles.map(role => ({
      label: role.name,
      value: role.id,
      description: role.description,
      emoji: role.emoji,
    }))
  );
```

## 4. Event Handling & Lifecycle

### 4.1 Ready Event Initialization

In the ready event, initialize all necessary services and set bot status:

```javascript
export default class ReadyEvent extends Event {
  execute() {
    console.log(`Logged in as ${this.client.user?.tag}`);
    
    this.client.user?.setPresence({
      status: 'online',
      activities: [{
        name: `${this.client.guilds.cache.size} servers`,
        type: ActivityType.Watching,
      }],
    });

    // Initialize services
    DatabaseService.getInstance().connect();
    CacheService.getInstance().connect();
  }
}
```

### 4.2 Error Boundaries

Wrap all interaction handlers in try-catch blocks to prevent crashes:

```javascript
try {
  await command.execute(interaction);
} catch (error) {
  logger.error(`Command failed: ${interaction.commandName}`, error);
  
  const errorMessage = 'An unexpected error occurred. Please try again later.';
  
  if (interaction.replied || interaction.deferred) {
    await interaction.editReply({ content: errorMessage, ephemeral: true });
  } else {
    await interaction.reply({ content: errorMessage, ephemeral: true });
  }
}
```

## 5. Database Design Patterns

### 5.1 Schema Design Principles

Design schemas with scalability in mind. Use UUIDs for public IDs to prevent enumeration. Include timestamps on all models. Use JSON fields for flexible settings storage.

### 5.2 Query Optimization

Use Prisma's `include` and `select` to optimize queries. Implement pagination for large datasets. Use indexes on frequently queried fields.

```javascript
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    economy: {
      select: {
        balance: true,
        bank: true,
      },
    },
  },
  take: 10,
  skip: (page - 1) * 10,
  orderBy: {
    createdAt: 'desc',
  },
});
```

## 6. Caching Strategies

### 6.1 Redis Implementation

Use Redis for:
- Session data
- Rate limiting counters
- Frequently accessed data (leaderboards, user settings)
- Temporary locks during operations

```javascript
export class CacheService {
  async getOrSet(key, fetcher, ttl) {
    const cached = await this.get(key);
    if (cached) return cached;

    const fresh = await fetcher();
    await this.set(key, fresh, ttl);
    return fresh;
  }
}
```

## 7. Rate Limiting & Cooldowns

### 7.1 Per-User Cooldowns

Implement cooldowns to prevent spam:

```javascript
export class CooldownService {
  constructor() {
    this.cooldowns = new Map();
  }

  set(userId, command, seconds) {
    const expires = Date.now() + seconds * 1000;
    
    if (!this.cooldowns.has(userId)) {
      this.cooldowns.set(userId, new Map());
    }
    
    this.cooldowns.get(userId).set(command, expires);
    
    setTimeout(() => {
      this.cooldowns.get(userId)?.delete(command);
    }, seconds * 1000);
  }

  check(userId, command) {
    const userCooldowns = this.cooldowns.get(userId);
    if (!userCooldowns) return 0;

    const expires = userCooldowns.get(command);
    if (!expires) return 0;

    const remaining = (expires - Date.now()) / 1000;
    return remaining > 0 ? remaining : 0;
  }
}
```

## 8. Embed Design System

### 8.1 Consistent Embed Builder

Create a utility for consistent embed styling:

```javascript
export class EmbedBuilder {
  static create(options = {}) {
    const {
      title,
      description,
      color,
      fields = [],
      footer,
      thumbnail,
      image,
      author,
    } = options;

    const embed = new Discord.EmbedBuilder()
      .setColor(color ?? this.colors.primary)
      .setTimestamp();

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (footer) embed.setFooter({ text: footer });
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);
    if (author) embed.setAuthor(author);
    if (fields) {
      fields.forEach(field => {
        embed.addFields({ name: field.name, value: field.value, inline: field.inline ?? false });
      });
    }

    return embed;
  }

  static colors = {
    primary: 0x5865F2,
    success: 0x57F287,
    warning: 0xFEE75C,
    danger: 0xED4245,
    info: 0x3BA55D,
  };
}
```

## 9. Permission & Authorization

### 9.1 Permission Hierarchy

Implement a permission system with hierarchy checks:

```javascript
export class PermissionManager {
  static hasPermission(member, permission) {
    return (member.permissions & permission) === permission;
  }

  static hasRole(member, roleId) {
    return member.roles.cache.has(roleId);
  }

  static isOwner(member, ownerId) {
    return member.id === ownerId || member.permissions.has(PermissionFlagBits.Administrator);
  }
}
```

## 10. Utility Functions

### 10.1 Time Formatting

```javascript
export function formatDuration(seconds) {
  const units = [
    { label: 'y', value: 31536000 },
    { label: 'mo', value: 2592000 },
    { label: 'w', value: 604800 },
    { label: 'd', value: 86400 },
    { label: 'h', value: 3600 },
    { label: 'm', value: 60 },
    { label: 's', value: 1 },
  ];

  return units.map(unit => {
    const amount = Math.floor(seconds / unit.value);
    seconds %= unit.value;
    return amount > 0 ? `${amount}${unit.label}` : '';
  }).filter(Boolean).join(' ') || '0s';
}
```

### 10.2 Number Formatting

```javascript
export function formatNumber(num) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}
```

## 11. Package Configuration

### 11.1 JavaScript Project

**package.json**
```json
{
  "name": "discord-bot",
  "version": "2.0.0",
  "description": "Professional Discord bot",
  "main": "src/index.js",
  "scripts": {
    "dev": "node src/index.js",
    "start": "node src/index.js",
    "deploy": "node scripts/deploy-commands.js",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write src/**/*.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "db:generate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "node scripts/seed-database.js",
    "docker:build": "docker build -t discord-bot .",
    "docker:run": "docker compose up -d"
  },
  "dependencies": {
    "discord.js": "^14.16.3",
    "@discordjs/builders": "^1.10.1",
    "@discordjs/rest": "^2.4.0",
    "discord-api-types": "^0.37.100",
    "zod": "^3.23.8",
    "prisma": "^5.22.0",
    "@prisma/client": "^5.22.0",
    "ioredis": "^5.4.0",
    "pino": "^9.5.0",
    "pino-pretty": "^13.0.0",
    "rate-limiter-flexible": "^5.0.3",
    "sanitize-html": "^2.14.0"
  },
  "devDependencies": {
    "eslint": "^9.15.0",
    "prettier": "^3.3.3",
    "vitest": "^2.1.6",
    "@vitest/coverage-v8": "^2.1.6"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### 11.2 TypeScript Project

Add TypeScript tooling when needed:

```json
{
  "dependencies": { /* same as above */ },
  "devDependencies": {
    "eslint": "^9.15.0",
    "prettier": "^3.3.3",
    "vitest": "^2.1.6",
    "@vitest/coverage-v8": "^2.1.6",
    "typescript": "^5.6.3",
    "ts-node": "^10.9.2",
    "@types/node": "^22.9.0",
    "@types/sanitize-html": "^2.13.0"
  },
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "deploy": "ts-node scripts/deploy-commands.ts",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

**tsconfig.json** (TypeScript only)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## 12. Health Checks & Monitoring

Create a health check script for container monitoring:

```javascript
export async function healthCheck() {
  return {
    status: 'ok',
    uptime: process.uptime(),
  };
}
```

### 11.2 Discord API Status

Monitor Discord API connectivity:

```javascript
export async function checkDiscordConnection(client) {
  try {
    await client.guilds.fetch();
    return true;
  } catch {
    return false;
  }
}
```

## 12. Logging Best Practices

### 12.1 Structured Logging

Use structured logging with consistent fields:

```javascript
logger.info({
  event: 'command_executed',
  command: 'balance',
  userId: user.id,
  guildId: guild?.id,
  duration: 42,
});
```

### 12.2 Error Tracking

Integrate with error tracking services:

```javascript
if (config.NODE_ENV === 'production') {
  // Sentry, Datadog, etc.
  captureException(error, {
    tags: {
      command: interaction.commandName,
      userId: interaction.user.id,
    },
  });
}
```

## 13. Deployment & Operations

### 13.1 Environment Configuration

Never hardcode secrets. Use environment variables for all sensitive data:

```bash
DISCORD_TOKEN=your_token
DISCORD_CLIENT_ID=your_client_id
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NODE_ENV=production
```

### 13.2 Process Management

Use PM2 for process management with auto-restart:

```javascript
module.exports = {
  apps: [{
    name: 'discord-bot',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
  }]
};
```

## 14. Common Pitfalls & Solutions

### 14.1 Handling Discord Rate Limits

Discord API has strict rate limits. Always use the built-in rate limit handling:

```javascript
// discord.js handles this automatically, but avoid manual rate limit bypassing
await interaction.reply({ content: 'Processing...' });
// Later...
await interaction.editReply({ content: 'Done!' });
```

### 14.2 Memory Leaks

Common memory leak sources:
- Unremoved event listeners
- Uncached message collections
- Uncleared intervals/timeouts

Always clean up collectors and listeners:

```javascript
const collector = interaction.channel.createMessageCollector({ /* options */ });
collector.on('end', () => {
  collector.removeAllListeners();
});
```

### 14.3 Interaction Token Expiry

Interaction tokens expire after 15 minutes. Always respond or defer within 3 seconds:

```javascript
if (!interaction.deferred && !interaction.replied) {
  await interaction.deferReply();
}
// Now safe to take time for processing
```

## 15. Advanced Techniques

### 15.1 Sharding

For bots in 2500+ servers, implement sharding:

```javascript
const manager = new ShardManager({
  totalShards: 'auto',
  mode: 'process',
  respawn: true,
});

manager.spawn();
```

### 15.2 Gateway Intents

Request only necessary intents:

```javascript
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
```

## 16. Testing Strategies

### 16.1 Unit Testing Commands

Mock the interaction object for unit testing:

```javascript
const mockInteraction = {
  commandName: 'ping',
  reply: vi.fn(),
  deferred: false,
  replied: false,
  user: { id: '123', tag: 'TestUser' },
};

await command.execute(mockInteraction);
expect(mockInteraction.reply).toHaveBeenCalledWith({ content: 'Pong!' });
```

### 16.2 Integration Testing

Test full command flows with a test client:

```javascript
describe('Balance Command', () => {
  it('should show user balance', async () => {
    const interaction = createMockInteraction();
    await command.execute(interaction);
    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: expect.arrayContaining([
          expect.objectContaining({
            title: expect.stringContaining('Balance'),
          }),
        ]),
      })
    );
  });
});
```

## 17. Internationalization (i18n)

Support multiple locales for global communities:

```javascript
const locales = {
  'en-US': {
    BALANCE_TITLE: 'Balance',
    BALANCE_DESCRIPTION: 'Your current balance',
  },
  'th-TH': {
    BALANCE_TITLE: 'ยอดคงเหลือ',
    BALANCE_DESCRIPTION: 'ยอดคงเหลือปัจจุบันของคุณ',
  },
};

function t(key, locale = 'en-US') {
  return locales[locale]?.[key] ?? key;
}
```

## 18. Analytics & Metrics

Track command usage and performance:

```javascript
export class Analytics {
  static trackCommand(command, userId, guildId, duration) {
    logger.info({
      event: 'command_used',
      command,
      userId,
      guildId,
      duration,
    });
  }
}
```

## 19. Migration & Versioning

Handle breaking changes gracefully:

```javascript
const MIGRATIONS = {
  '1.0.0': async (prisma) => {
    // Migration logic
  },
};

async function migrate(prisma, currentVersion) {
  const versions = Object.keys(MIGRATIONS).sort();
  for (const version of versions) {
    if (semver.gt(version, currentVersion)) {
      await MIGRATIONS[version](prisma);
    }
  }
}
```

## 20. Continuous Improvement

### 20.1 Code Review Checklist

- [ ] All interactions have error handling
- [ ] Commands have proper permission checks
- [ ] No hardcoded values or secrets
- [ ] TypeScript strict mode passes
- [ ] All tests pass
- [ ] Documentation is updated

### 20.2 Performance Monitoring

Monitor:
- Command execution time
- Database query performance
- Memory usage
- API response times

Use APM tools like Datadog, New Relic, or open-source alternatives.

## Resources

- [discord.js Guide](https://discordjs.guide/)
- [Discord API Docs](https://discord.com/developers/docs)
- [discord.js Documentation](https://discord.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

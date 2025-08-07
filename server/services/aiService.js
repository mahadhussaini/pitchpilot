const OpenAI = require('openai');
const { OpenAIEmbeddings } = require('langchain/embeddings/openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Generate pitch deck content based on startup info
  async generatePitchDeck(startupInfo, targetInvestors = []) {
    try {
      const prompt = this.buildDeckGenerationPrompt(startupInfo, targetInvestors);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert pitch deck consultant with deep knowledge of YC, Sequoia, and Techstars best practices. Generate compelling, investor-ready pitch deck content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const content = completion.choices[0].message.content;
      return this.parseDeckContent(content);
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      throw new Error('Failed to generate pitch deck content');
    }
  }

  // Build comprehensive prompt for deck generation
  buildDeckGenerationPrompt(startupInfo, targetInvestors) {
    const investorContext = targetInvestors.length > 0 
      ? `Target investors: ${targetInvestors.map(inv => `${inv.type} focused on ${inv.focus.join(', ')}`).join(', ')}`
      : 'General investor audience';

    return `
Generate a complete pitch deck for the following startup:

Startup Name: ${startupInfo.name}
Industry: ${startupInfo.industry}
Stage: ${startupInfo.stage}
Funding Goal: $${startupInfo.fundingGoal?.toLocaleString() || 'TBD'}
Current Funding: $${startupInfo.currentFunding?.toLocaleString() || '0'}
Team Size: ${startupInfo.teamSize || 'TBD'}
Founded: ${startupInfo.foundedYear || 'TBD'}

Problem: ${startupInfo.problem}
Solution: ${startupInfo.solution}
Market Size: ${startupInfo.marketSize}
Traction: ${startupInfo.traction}
Competitors: ${startupInfo.competitors?.join(', ') || 'None specified'}
Business Model: ${startupInfo.businessModel}

Financials:
- Revenue: $${startupInfo.financials?.revenue?.toLocaleString() || '0'}
- Growth: ${startupInfo.financials?.growth || '0'}%
- Burn Rate: $${startupInfo.financials?.burnRate?.toLocaleString() || '0'}/month
- Runway: ${startupInfo.financials?.runway || '0'} months

${investorContext}

Generate the following slides in JSON format:
1. Problem Slide (title, key points, visual description)
2. Solution Slide (title, key points, visual description)
3. Market Opportunity Slide (title, key points, visual description)
4. Traction Slide (title, key points, visual description)
5. Business Model Slide (title, key points, visual description)
6. Team Slide (title, key points, visual description)
7. Financials Slide (title, key points, visual description)
8. Ask Slide (title, key points, visual description)

Format each slide as:
{
  "type": "slide_type",
  "title": "Slide Title",
  "content": {
    "headline": "Main headline",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "visualDescription": "Description of suggested visual",
    "callToAction": "Action item for this slide"
  }
}

Make content compelling, data-driven, and tailored to the startup's stage and target investors.
    `;
  }

  // Parse AI-generated content into structured slide data
  parseDeckContent(content) {
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const slides = JSON.parse(jsonMatch[0]);
      return slides.map((slide, index) => ({
        type: slide.type,
        title: slide.title,
        content: slide.content,
        order: index + 1,
        aiFeedback: {
          clarity: 8,
          persuasiveness: 8,
          suggestions: [],
          tone: 'professional'
        }
      }));
    } catch (error) {
      console.error('Error parsing deck content:', error);
      // Fallback to basic slide structure
      return this.generateFallbackSlides();
    }
  }

  // Generate fallback slides if AI parsing fails
  generateFallbackSlides() {
    const defaultSlides = [
      {
        type: 'problem',
        title: 'The Problem',
        content: {
          headline: 'What problem are you solving?',
          keyPoints: ['Define the problem clearly', 'Show market pain points', 'Quantify the opportunity'],
          visualDescription: 'Problem statement with supporting data',
          callToAction: 'Clearly articulate the problem'
        },
        order: 1,
        aiFeedback: { clarity: 7, persuasiveness: 7, suggestions: [], tone: 'professional' }
      },
      {
        type: 'solution',
        title: 'Our Solution',
        content: {
          headline: 'How do you solve it?',
          keyPoints: ['Your unique approach', 'Key differentiators', 'Product/market fit'],
          visualDescription: 'Solution overview with key features',
          callToAction: 'Demonstrate your solution'
        },
        order: 2,
        aiFeedback: { clarity: 7, persuasiveness: 7, suggestions: [], tone: 'professional' }
      }
    ];

    return defaultSlides;
  }

  // Analyze slide content and provide feedback
  async analyzeSlide(slideContent, slideType) {
    try {
      const prompt = `
Analyze this pitch deck slide and provide feedback:

Slide Type: ${slideType}
Content: ${JSON.stringify(slideContent)}

Provide feedback in JSON format:
{
  "clarity": 1-10 score,
  "persuasiveness": 1-10 score,
  "suggestions": ["suggestion1", "suggestion2"],
  "tone": "professional|casual|confident|humble"
}
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert pitch deck consultant. Provide constructive, actionable feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      const content = completion.choices[0].message.content;
      const feedback = JSON.parse(content);
      
      return feedback;
    } catch (error) {
      console.error('Error analyzing slide:', error);
      return {
        clarity: 6,
        persuasiveness: 6,
        suggestions: ['Review content for clarity'],
        tone: 'professional'
      };
    }
  }

  // Generate investor-specific customizations
  async customizeForInvestor(deckContent, investorProfile) {
    try {
      const prompt = `
Customize this pitch deck content for a specific investor:

Investor Profile:
- Type: ${investorProfile.type}
- Focus Areas: ${investorProfile.focus.join(', ')}
- Investment Stage: ${investorProfile.stage.join(', ')}
- Location: ${investorProfile.location}

Original Content: ${JSON.stringify(deckContent)}

Provide customized content that emphasizes aspects most relevant to this investor.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at tailoring pitch content for specific investors."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error customizing for investor:', error);
      return deckContent; // Return original content if customization fails
    }
  }

  // Generate slide improvement suggestions
  async suggestImprovements(slideContent, slideType, targetInvestor = null) {
    try {
      let prompt = `
Suggest improvements for this pitch deck slide:

Slide Type: ${slideType}
Content: ${JSON.stringify(slideContent)}
      `;

      if (targetInvestor) {
        prompt += `\nTarget Investor: ${targetInvestor.type} focused on ${targetInvestor.focus.join(', ')}`;
      }

      prompt += '\n\nProvide specific, actionable suggestions to improve clarity, persuasiveness, and impact.';

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert pitch deck consultant. Provide specific, actionable improvement suggestions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error generating improvements:', error);
      return 'Review content for clarity and impact. Consider adding more specific data and metrics.';
    }
  }
}

module.exports = new AIService(); 
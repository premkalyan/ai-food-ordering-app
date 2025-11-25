import { ChatResponse, ResponseOption } from '../types/ui';
import { FEATURE_FLAGS } from '../config/features';

// Render response options based on platform
export function renderResponseOptions(
  options: ResponseOption[],
  onSelect: (option: ResponseOption) => void
): JSX.Element | string {
  if (FEATURE_FLAGS.ENABLE_BUTTONS) {
    // Button mode (Web/Mobile)
    return (
      <div className="response-options">
        {options.map((option) => {
          const variantStyles = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
            success: 'bg-green-600 hover:bg-green-700 text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white',
          };

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors text-left ${
                variantStyles[option.variant || 'secondary']
              }`}
            >
              {option.icon && <span className="mr-2">{option.icon}</span>}
              {option.label}
            </button>
          );
        })}
      </div>
    ) as any;
  } else {
    // Text mode (GPT)
    let text = '\n\n';
    options.forEach((option, idx) => {
      text += `${idx + 1}. ${option.label}\n`;
    });
    text += '\nType the number to select.';
    return text;
  }
}

// Format message with options
export function formatChatResponse(response: ChatResponse): string {
  let output = response.message;
  
  if (!FEATURE_FLAGS.ENABLE_BUTTONS) {
    // Add numbered options for text mode
    output += '\n\n';
    response.options.forEach((option, idx) => {
      output += `${idx + 1}. ${option.label}\n`;
    });
    output += '\nType the number to select.';
  }
  
  return output;
}

// Parse user input in text mode
export function parseTextInput(
  input: string,
  options: ResponseOption[]
): ResponseOption | null {
  // Try to parse as number
  const num = parseInt(input.trim());
  if (!isNaN(num) && num > 0 && num <= options.length) {
    return options[num - 1];
  }
  
  // Try to match by label (case-insensitive)
  const match = options.find(opt =>
    opt.label.toLowerCase().includes(input.toLowerCase())
  );
  
  return match || null;
}


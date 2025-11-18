const AGENT_API_URLS: Record<string, string> = {
  emergency_response_agent: 'https://emergency-response-service-877598034358.us-central1.run.app',
  volunteer_donation_agent: 'https://volunteer-donation-service-877598034358.us-central1.run.app',
  safety_preparation_agent: 'https://safety-prep-service-877598034358.us-central1.run.app',
  suicide_prevention_agent: 'https://mental-health-service-877598034358.us-central1.run.app',
};

const getApiBaseUrl = (agentId: string): string => {
  const baseUrl = AGENT_API_URLS[agentId];
  if (!baseUrl) {
    throw new Error(`No API URL configured for agentId: ${agentId}`);
  }
  return baseUrl;
};


export const createSession = async (agentId: string): Promise<string> => {
  const baseUrl = getApiBaseUrl(agentId);
  // Assuming the path structure remains consistent for each service
  const createSessionUrl = `${baseUrl}/users/user/sessions`;
  
  try {
    const response = await fetch(createSessionUrl, {
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (errorText === "") {
        throw new Error(`Failed to create session: ${response.status} ${response.statusText}. This is likely a CORS issue. Please ensure the server at ${createSessionUrl} is running and configured to accept requests from this origin.`);
      }
      throw new Error(`Failed to create session: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.id) {
      throw new Error("Session ID not found in the API response.");
    }

    return data.id;

  } catch (error) {
    console.error("Session creation failed:", error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Failed to fetch. This is likely a CORS issue or the server is not running. Please check the server at ${createSessionUrl} and its CORS policy.`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred during session creation.");
  }
};

export const streamAgentResponse = async (
  userInput: string,
  sessionId: string,
  agentId: string,
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void,
  onComplete: () => void
): Promise<void> => {
  const baseUrl = getApiBaseUrl(agentId);
  const agentApiUrl = `${baseUrl}/run_sse`;
  
  const requestBody = {
    appName: agentId,
    userId: "user",
    sessionId: sessionId,
    newMessage: {
      role: "user",
      parts: [{ text: userInput }]
    },
    streaming: true,
    stateDelta: null
  };

  try {
    const response = await fetch(agentApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      throw new Error(`Network error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const messageString = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 2);

        if (messageString.startsWith("data: ")) {
          const jsonString = messageString.substring(6);
          try {
            const event = JSON.parse(jsonString);
            
            if (event.content && event.content.role === "model" && event.content.parts && event.content.parts.length > 0) {
              const textChunk = event.content.parts[0].text;
              if (textChunk) {
                onChunk(textChunk);
              }
            }
          } catch (e) {
            console.error("Failed to parse SSE JSON:", e, jsonString);
          }
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      onError(error);
    } else {
      onError(new Error('An unknown error occurred during streaming.'));
    }
  } finally {
    onComplete();
  }
};
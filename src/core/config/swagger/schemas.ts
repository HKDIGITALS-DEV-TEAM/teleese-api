export const swaggerSchemas = {
  UserDTO: {
    type: "object",
    properties: {
      id: { type: "string" },
      keycloakId: { type: "string" },
      email: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
      role: { type: "string" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
    },
  },
  CallDTO: {
    type: "object",
    properties: {
      id: { type: "string" },
      sessionId: { type: "string" },
      phoneNumber: { type: "string" },
      transcript: { type: "string" },
      status: { type: "string" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
    },
  },
  CompanyDTO: {
    type: "object",
    properties: {
      id: { type: "string" },
      owner_id: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      phone_number: { type: "string" },
      twilio_phone_number: { type: "string" },
      secondary_phone_number: { type: "string" },
      specific_configurations: { type: "string" },
      option: { type: "string" },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
    },
  },
};

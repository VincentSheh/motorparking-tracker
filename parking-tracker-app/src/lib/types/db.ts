export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  provider: "github" | "line";
};

// export type Document = {
//   id: string;
//   title: string;
//   content: string;
//   userId?: string;
// };

// export type messages = {
//   id: string;
//   message: string;
// }
// export type Message = {
//   messageId: string;
//   content: string;
//   senderId: User["id"];
//   deleteFor?: User["id"];
//   timestamp?: Date;
// };

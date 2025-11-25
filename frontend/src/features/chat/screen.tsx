import { Container } from "@/src/ui/custom/container";

export const ChatScreen = () => {
  return (
    <Container>
      <div className="space-y-4 p-6">
        <h1 className="text-center font-bold text-3xl">Chat Page</h1>
        <p className="text-center text-gray-600 text-lg">
          Here you can ask for possible Neural Network designs tailored towards your problem by our
          specialized AI agents
        </p>
        <p className="text-center text-base text-gray-500">Give it a shot</p>
      </div>
    </Container>
  );
};

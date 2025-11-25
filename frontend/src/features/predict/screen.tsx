import { Container } from "@/src/ui/custom/container";

export const PredictScreen = () => {
  return (
    <Container>
      <div className="space-y-4 p-6">
        <h1 className="text-center font-bold text-3xl">Prediction Page</h1>
        <p className="text-center text-gray-600 text-lg">
          Here we will predict your model's possible performance metrics
        </p>
        <p className="text-center text-base text-gray-500">Give it a shot</p>
      </div>
    </Container>
  );
};

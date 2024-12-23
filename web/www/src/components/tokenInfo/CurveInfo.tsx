import ProgressBar from "../ProgressBar";

export default function CurveInfo() {
  return (
    <div className="flex flex-col space-y-4 py-4">
      <div className="flex flex-col space-y-2">
        <p>Bounding Curve Progress</p>
        <ProgressBar values={[0.5]} />
      </div>
    </div>
  );
}

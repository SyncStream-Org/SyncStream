import { echo } from '../../api/routes/misc';
import './launch.css';
import '../../renderer/App.css'

export default function Launch() {
  return (
    <div>
      <h1 className="bg-gray-500 text-center text-white">
        Hi Tailwind has been integrated.
      </h1>
      <h1>Test</h1>
      <button type="button" className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded" onClick={echo}>Echo</button>
    </div>
  );
}

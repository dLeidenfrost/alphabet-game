import { PlayLayout } from '../components/layout';

function PlayScreen() {
  return (
    <PlayLayout timeLimit={180}>
      {/* font-inter uses the Inter Variable font defined in the Tailwind theme */}
      <div class="font-inter">PlayScreen</div>
    </PlayLayout>
  );
}

export default PlayScreen;

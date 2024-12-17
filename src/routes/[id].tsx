// Let's a user view their card by ID

import { useParams } from "@solidjs/router";
import {
  createEffect,
  createResource,
  createSignal,
  Show,
  Suspense,
} from "solid-js";

export default function Page() {
  const params = useParams();

  createEffect(async () => {
    // Typescript no longer allows screen.orientation.lock, see https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1615
    // @ts-ignore
    if (screen && screen.orientation && screen.orientation.lock) {
      // @ts-ignore
      await screen.orientation.lock("landscape-primary");
    }
  });

  return (
    <Suspense fallback={<Loading />}>
      <Card id={params.id} />
    </Suspense>
  );
}

type CardDetails = { id: string };

function Card(props: { id: string }) {
  const [hasBeenFlipped, setHasBeenFlipped] = createSignal(false);
  const [isFlipped, setIsFlipped] = createSignal(false);
  const [cardDetails, { mutate, refetch }] = createResource<CardDetails>(
    async () => {
      const response: { id: string } = await new Promise((resolve) =>
        setTimeout(() => resolve({ id: props.id }), 1000),
      );
      return response;
    },
  );

  function flip() {
    setHasBeenFlipped(true);
    setIsFlipped(!isFlipped());
  }

  return (
    <Show when={cardDetails()}>
      <div class="card">
        <div
          class="card-inner"
          classList={{
            flipped: isFlipped(),
          }}
          style={
            hasBeenFlipped()
              ? {
                  "animation-name": isFlipped() ? "flip" : "unflip",
                }
              : {}
          }
        >
          <div class="front">
            <FlipButton onMouseDown={flip} />
            Front
          </div>
          <div class="back">
            <FlipButton onMouseDown={flip} />
            {cardDetails()?.id}
          </div>
        </div>
      </div>
    </Show>
  );
}

function FlipButton(props: { onMouseDown: () => void }) {
  return (
    <button
      class="flip-button"
      onMouseDown={() => {
        props.onMouseDown();
      }}
    >
      Flip
    </button>
  );
}

function Loading() {
  return <div>Loading...</div>;
}

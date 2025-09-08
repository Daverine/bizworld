<script setup>
definePageMeta({ layout: 'details', auth: true, noFab: true });
</script>
<template>
  <div class="messaging-view">
    <div class="history-view">
      <header
        class="pin-top-blend surface-bg"
        style="
          display: flex;
          flex-flow: column nowrap;
          gap: 0.5em;
          padding: 0.5em;
        "
      >
        <LimbDropdown
          class="selection"
          style="display: flex; align-items: center"
        >
          <template #trailing>
            <Icon
              name="material-symbols:expand-more-rounded"
              class="trailing"
            />
          </template>
          <div class="drop menu">
            <div class="active item">
              <div
                class="lead avatar circular image mini"
                style="flex: 0 0 auto; background-color: #999"
              ></div>
              <div style="flex: 1 1 auto">
                <div class="text text-left">
                  <div
                    class="semibold"
                    style="font-size: 1.125em; line-height: 1.25"
                  >
                    Ayoola Folorunso
                  </div>
                  <div class="small faint-text">Personal Account</div>
                </div>
              </div>
            </div>
            <div class="item">
              <div
                class="lead avatar circular image mini"
                style="flex: 0 0 auto; background-color: #999"
              ></div>
              <div style="flex: 1 1 auto">
                <div class="text text-left">
                  <div
                    class="semibold"
                    style="font-size: 1.125em; line-height: 1.25"
                  >
                    Emmadave Computers
                  </div>
                  <div class="small faint-text">Business Account</div>
                </div>
              </div>
            </div>
          </div>
        </LimbDropdown>
        <label class="transparent input" style="background-color: var(--surface-v4);">
          <Icon name="material-symbols:search-rounded" />
          <input type="text" class="subject" placeholder="Search" />
        </label>
      </header>
      <div style="flex: 1 1 auto"></div>
      <footer class="pin-bottom-blend" style="padding: 0.5em;">
        <button class="button primary fluid">
          <Icon
            name="material-symbols:chat-add-on-outline-rounded"
            class="lead"
          />
          New chat
        </button>
      </footer>
    </div>
    <div class="chat-view">
      <header
        style="padding: 0em 0.5em; border-bottom: 1px solid var(--outline)"
      >
        <div
          class="icon-bar compact menu"
          style="border-radius: var(--default-radius)"
        >
          <div class="adaptable xhover item">
            <div
              class="lead avatar circular image mini"
              style="flex: 0 0 auto; background-color: #999"
            ></div>
            <div style="flex: 1 1 auto">
              <div class="text text-left">
                <div
                  class="semibold"
                  style="font-size: 1.125em; line-height: 1.25"
                >
                  Ayoola Folorunso
                </div>
                <div class="small faint-text">Online</div>
              </div>
            </div>
          </div>
          <div class="r-aligned items">
            <div class="item">
              <Icon name="material-symbols:call-outline-rounded" />
            </div>
            <div class="item">
              <Icon name="material-symbols:video-call-outline-rounded" />
            </div>
            <div class="item">
              <Icon name="material-symbols:more-horiz" />
            </div>
          </div>
        </div>
      </header>
      <div class="chats-box"></div>
      <footer class="messaging-box field 0-margined">
        <div class="input">
          <button class="icon">
            <Icon name="material-symbols:mood-outline-rounded" />
          </button>
          <button class="icon">
            <Icon name="material-symbols:add-rounded" />
          </button>
          <input class="subject" type="text" placeholder="Type your message" />
          <button class="icon">
            <Icon name="material-symbols:mic-rounded" />
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
.messaging-view {
  display: flex;
  position: relative;
  width: 100%;
  height: calc(100vh - 68px);
  // box-shadow: var(--z-depth-1);
  overflow: hidden;

  .history-view {
    width: 18rem;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    overflow: hidden;
    border-right: 1px solid var(--outline);
  }

  .chat-view {
    display: flex;
    flex-flow: column nowrap;
    width: calc(100% - 20rem);
    flex: 1 1 auto;
    border-radius: inherit;

    .chats-box {
      flex: 1 1 0;
      overflow: hidden auto;
    }

    .messaging-box {
      padding: 0.5em;
      border-top: 1px solid var(--outline);
    }
  }
}
</style>

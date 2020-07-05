<template>
  <v-tabs centered slider-color="yellow" id="ip-optionPanel">
    <v-tab>Batch Download</v-tab>
    <v-tab>Single Download</v-tab>
    <v-tab-item>
      <v-card flat>
        <v-list>
          <v-subheader>View</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="settings.view.showImageName"
                @change="$emit('setting-change', 'showImageName')"
                label="Show Image Name"
              ></v-checkbox>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="settings.view.showImageMeta"
                @change="$emit('setting-change', 'showImageMeta')"
                label="Show Image Meta"
              ></v-checkbox>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox
                v-model="settings.view.showImageUrl"
                @change="$emit('setting-change', 'showImageUrl')"
                label="Show Image URL"
              ></v-checkbox>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
          <v-subheader>View Mode</v-subheader>
          <v-list-item>
            <v-radio-group
              row
              v-model="settings.view.viewMode"
              @change="$emit('setting-change', 'viewMode')"
            >
              <v-radio label="Thumbnail" value="Thumbnail"></v-radio>
              <v-radio label="Fit to Width" value="FitWidth"></v-radio>
              <v-radio label="100%" value="Percent100"></v-radio>
            </v-radio-group>
          </v-list-item>
          <v-list-item v-if="settings.view.viewMode == 'Thumbnail'">
            <v-slider
              v-model="settings.view.thumbnailWidth"
              @change="$emit('setting-change', 'thumbnailWidth')"
              thumb-label
              min="50"
              max="1000"
              label="Thumbnail Size"
            ></v-slider>
          </v-list-item>
          <v-divider></v-divider>
          <v-subheader>Behavior</v-subheader>
          <v-list-item>
            <v-row row align-baseline justify-start fill-height>
              <v-col>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">Like Image</span>
                      </template>
                      <span>
                        In the "Selected" tab, ignore image to download by click
                        with key.
                        <br />In the "UnSelected" tab, add image to download by
                        click with key.
                      </span>
                    </v-tooltip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-col>
              <v-col>
                <v-select
                  v-model="settings.behavior.likeImage"
                  @change="$emit('setting-change', 'likeImage')"
                  :items="likeImageOptions"
                  item-text="label"
                  item-value="value"
                  single-line
                  class="ip-likeImageSelect"
                ></v-select>
                <v-spacer></v-spacer>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-tab-item>
    <v-tab-item>
      <v-card flat>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Save image by</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-select
                v-model="settings.sinlgeDownload.action"
                @change="$emit('setting-change', 'singleDownloadAction')"
                :items="saveImageOptions"
                item-text="label"
                item-value="value"
                single-line
                class="ip-saveImageSelect"
              ></v-select>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                >Create sub folder by tab title</v-list-item-title
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-switch
                v-model="settings.sinlgeDownload.createSubFolderByTitle"
                @change="$emit('setting-change', 'createSubFolderByTitle')"
              />
            </v-list-item-action>
          </v-list-item>
          <!--
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Ask where to save image in a new tab</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="settings.sinlgeDownload.askLocationForNewTab"/>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Ask where to save image when dragging to left</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch v-model="settings.sinlgeDownload.askLocationWhenDragLeft"/>
            </v-list-item-action>
          </v-list-item>
          -->
        </v-list>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  props: {
    settings: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      likeImageOptions: [
        { label: "Click Only", value: "ClickOnly" },
        { label: "Ctrl + Click", value: "CtrlClick" },
        { label: "Alt + Click", value: "AltClick" },
        { label: "Shift + Click", value: "ShiftClick" }
      ],

      saveImageOptions: [
        { label: "Click Only", value: "ClickOnly" },
        { label: "Ctrl + Click", value: "CtrlClick" },
        { label: "Alt + Click", value: "AltClick" },
        { label: "Shift + Click", value: "ShiftClick" },
        { label: "Drag", value: "Drag" }
      ]
    };
  }
};
</script>

<style>
.ip-likeImageSelect {
  width: 180px;
}

.ip-saveImageSelect {
  width: 180px;
}

#ip-optionPanel {
  min-width: 420px;
}
</style>

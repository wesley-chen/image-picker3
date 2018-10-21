<template>
    <v-card>
        <v-list subheader>
            <v-subheader>View</v-subheader>
            <v-list-tile>
                <v-list-tile-action>
                    <v-checkbox
                        v-model="settings.view.showImageName"
                        @change="$emit('setting-change', 'showImageName')"
                        label="Show Image Name"
                    ></v-checkbox>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-action>
                    <v-checkbox
                        v-model="settings.view.showImageMeta"
                        @change="$emit('setting-change','showImageMeta')"
                        label="Show Image Meta"
                    ></v-checkbox>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-action>
                    <v-checkbox
                        v-model="settings.view.showImageUrl"
                        @change="$emit('setting-change','showImageUrl')"
                        label="Show Image URL"
                    ></v-checkbox>
                </v-list-tile-action>
            </v-list-tile>
            <v-divider></v-divider>
            <v-subheader>View Mode</v-subheader>
            <v-list-tile>
                <v-radio-group
                    row
                    v-model="settings.view.viewMode"
                    @change="$emit('setting-change','viewMode')"
                >
                    <v-radio label="Thumbnail" value="Thumbnail"></v-radio>
                    <v-radio label="Fit to Width" value="FitWidth"></v-radio>
                    <v-radio label="100%" value="Percent100"></v-radio>
                </v-radio-group>
            </v-list-tile>
            <v-list-tile v-if="settings.view.viewMode == 'Thumbnail'">
                <v-slider
                    v-model="settings.view.thumbnailWidth"
                    @change="$emit('setting-change', 'thumbnailWidth')"
                    thumb-label
                    min="50"
                    max="1000"
                    label="Thumbnail Size"
                ></v-slider>
            </v-list-tile>
            <v-divider></v-divider>
            <v-subheader>Behavior</v-subheader>
            <v-list-tile>
                <v-layout row align-baseline justify-start fill-height>
                    <v-flex>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <v-tooltip top>
                                    <span slot="activator">Like Image</span>
                                    <span>In the "Selected" tab, ignore image to download by click with key.
                                        <br>In the "UnSelected" tab, add image to download by click with key.
                                    </span>
                                </v-tooltip>
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-flex>
                    <v-flex>
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
                    </v-flex>
                </v-layout>
            </v-list-tile>
        </v-list>
    </v-card>
</template>

<script>
export default {
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      likeImageOptions: [
        { label: 'Click Only', value: 'ClickOnly' },
        { label: 'Ctrl + Click', value: 'CtrlClick' },
        { label: 'Alt + Click', value: 'AltClick' },
        { label: 'Shift + Click', value: 'ShiftClick' },
      ],
    };
  },
};
</script>

<style>
.ip-likeImageSelect {
  width: 180px;
}
</style>

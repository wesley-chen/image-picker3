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
};
</script>

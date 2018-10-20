<template>
    <v-card>
        <v-list subheader>
            <v-subheader>View</v-subheader>
            <v-list-tile>
                <v-list-tile-action>
                    <v-checkbox
                        v-model="settings.view.showImageName"
                        @change="$emit('setting-change')"
                        label="Show Image Name"
                    ></v-checkbox>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-action>
                    <v-checkbox
                        v-model="settings.view.showImageMeta"
                        @change="$emit('setting-change')"
                        label="Show Image Meta"
                    ></v-checkbox>
                </v-list-tile-action>
            </v-list-tile>
            <v-list-tile>
                <v-list-tile-action>
                    <v-checkbox
                        v-model="settings.view.showImageUrl"
                        @change="$emit('setting-change')"
                        label="Show Image URL"
                    ></v-checkbox>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
        <v-divider></v-divider>
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

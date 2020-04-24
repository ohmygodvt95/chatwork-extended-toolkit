<template>
  <div>
    <v-row>
      <v-col cols="8" offset="2">
        <v-banner single-line>
          <h1>Sticker Data Source</h1>
        </v-banner>
        <br />
        <v-row>
          <v-col col="6" offset="2">
            <v-text-field v-model="source" label="New data source url" outlined clearable small></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn large color="primary" @click="addNewDataSource()">Add</v-btn>
          </v-col>
        </v-row>
        <v-card>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Version</th>
                  <th class="text-left">Src</th>
                  <th class="text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in stickerDataSourceSync" :key="item.name + item.version">
                  <td>{{ item.name }}</td>
                  <td>{{ item.version }}</td>
                  <td>
                    <a :href="item.src" target="_blank">{{ item.src }}</a>
                  </td>
                  <td>
                    {{ item.type }}
                    <v-btn v-if="item.type === 'custom'" icon color="error" small @click="deleteSource(item)"><v-icon small>mdi-delete</v-icon></v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Common from '../../../lib/Common';

export default {
  data() {
    return {
      source: '',
      stickerDataSourceSync: [],
      stickerDataSourceLocal: []
    };
  },
  methods: {
    addNewDataSource() {
      const thisInt = this;
      const source = { url: this.source };
      this.$http.get(source.url).then(function(res, err) {
        if (thisInt.stickerDataSourceSync.filter(d => d.name === res.data.data_name).length === 0) {
          const newResource = {
            name: res.data.data_name,
            version: res.data.data_version,
            src: source.url,
            type: 'custom',
          };

          thisInt.stickerDataSourceSync.push(newResource);

          chrome.storage.sync.set(
            {
              stickerDataSource: thisInt.stickerDataSourceSync,
            },
            async function() {
              newResource.data = (await thisInt.$http.get(newResource.src)).data.emoticons;
              thisInt.stickerDataSourceLocal.push(newResource);
              chrome.storage.local.set({
                stickerDataSource: thisInt.stickerDataSourceLocal,
                CWET_EMOS_LIST: Common.generateStickerData(thisInt.stickerDataSourceLocal),
                CWET_EMOS_PACKAGE_LIST: Common.generateStickerPackageList(thisInt.stickerDataSourceLocal),
              }, function() {
                alert('Successfully');
              });
            }
          );
        } else {
          alert('Data already exists');
        }
      });
      this.source = '';
    },
    async deleteSource(item) {
      const thisInt = this;
      thisInt.stickerDataSourceSync = thisInt.stickerDataSourceSync.filter(d => {
        return d.name !== item.name;
      });

      thisInt.stickerDataSourceLocal = thisInt.stickerDataSourceLocal.filter(d => {
        return d.name !== item.name;
      });

      chrome.storage.sync.set(
        {
          stickerDataSource: thisInt.stickerDataSourceSync,
        },
        function() {
          chrome.storage.local.set(
            {
              stickerDataSource: thisInt.stickerDataSourceLocal,
              CWET_EMOS_LIST: Common.generateStickerData(thisInt.stickerDataSourceLocal),
              CWET_EMOS_PACKAGE_LIST: Common.generateStickerPackageList(thisInt.stickerDataSourceLocal),
            },
            function() {
              alert('Successfully');
            }
          );
        }
      );
    },
  },
  mounted() {
    const thisInt = this;
    chrome.storage.sync.get(
      {
        stickerDataSource: [],
      },
      function(item) {
        thisInt.stickerDataSourceSync = item.stickerDataSource;
      }
    );

    chrome.storage.local.get(
      {
        stickerDataSource: [],
        CWET_EMOS_LIST: [],
        CWET_EMOS_PACKAGE_LIST: ''
      },
      function(item) {
        thisInt.stickerDataSourceLocal = item.stickerDataSource;
      }
    );
  },
};
</script>

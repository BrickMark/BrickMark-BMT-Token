<template>
  <v-container id="options-dropdown" class="white" v-if="$store.getters.bvtAddress">
    <h2 class="pa-2">Current Voting</h2>
    <v-row>
      <v-col cols="8">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Voting Property</th>
                <th class="text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Voting Address</td>
                <td>{{$store.getters.bvtAddress}}</td>
              </tr>
              <tr>
                <td>Name / Symbol</td>
                <td>{{$store.getters.bvtInfo.name}} / {{$store.getters.bvtInfo.symbol}}</td>
              </tr>
              <tr>
                <td>Decimals</td>
                <td>{{$store.getters.bvtInfo.decimals}}</td>
              </tr>
              <tr>
                <td>Total Supply</td>
                <td
                  v-if="$store.getters.exactBalance == true"
                >{{ $store.getters.bvtInfo.totalSupply}}</td>
                <td v-else>{{ $store.getters.bvtInfo.hTotalSupply}}</td>
              </tr>
              <tr>
                <td>Voting Hash</td>
                <td>{{ $store.getters.bvtInfo.votingTextHash}}</td>
              </tr>
              <tr>
                <td>Number of Voting Options</td>
                <td>{{ $store.getters.bvtInfo.votingOptions}}</td>
              </tr>
              <tr>
                <td>Voting State</td>
                <td>
                  <v-stepper v-model="$store.getters.bvtInfo.state"  alt-labels>
                    <v-stepper-header>
                      <v-stepper-step :complete="$store.getters.bvtInfo.state >= 0" step="1">Init</v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step :complete="$store.getters.bvtInfo.state > 0" step="2">Voting</v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step :complete="$store.getters.bvtInfo.state > 1" step="3">Ended</v-stepper-step>
                    </v-stepper-header>
                  </v-stepper>
                </td>
              </tr>
              <tr>
                <td>Start Time</td>
                <td>{{ $store.getters.bvtInfo.startTime}}</td>
              </tr>
              <tr>
                <td>End Time</td>
                <td>{{ $store.getters.bvtInfo.endTime}}</td>
              </tr>
              <tr>
                <td>Current Votes</td>
                <td>
                  <div v-for="vote in $store.getters.bvtInfo.votes" v-bind:key="vote.option">
                    Option {{vote.option}}
                    <v-progress-linear
                      height="20"
                      reactive
                      :value="vote.percentage"
                    >{{vote.percentage}}% ({{ vote.votes }} votes)</v-progress-linear>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="4">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Name (Voter)</th>
                <th class="text-left">Address</th>
                <th class="text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="investor in $store.getters.bvtUsers" v-bind:key="investor.address">
                <td>{{ investor.name }}</td>
                <td>{{ investor.shortAddress }}</td>
                <td v-if="$store.getters.exactBalance == true">{{investor.balance }}</td>
                <td v-else>{{ investor.hBalance }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import blockchain from "../../js/blockchainInterface";
export default {
  name: "VotingInfoView",
  data: () => ({
    step: 1
  })
};
</script>
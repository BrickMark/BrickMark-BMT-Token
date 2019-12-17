<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <tbody>
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
            <td v-if="$store.getters.exactBalance == true">{{ $store.getters.bvtInfo.totalSupply}}</td>
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
            <td>{{ $store.getters.bvtInfo.state}}</td>
          </tr>
          <tr>
            <td>Start Time</td>
            <td>{{ $store.getters.bvtInfo.startTime}}</td>
          </tr>
          <tr>
            <td>End Time</td>
            <td>{{ $store.getters.bvtInfo.startTime}}</td>
          </tr>
          <tr>
            <td>Current Votes</td>
            <td>{{ $store.getters.bvtInfo.votes}}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import blockchain from "../../js/blockchainInterface";

export default {
  name: "VotingInfoView"
};

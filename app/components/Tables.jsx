import React, { Component } from "react";
import { Table } from "antd";
import { isEquivalent } from "../redux/utils";

import columns from '../assets/tableData/tableColumn';


function filterLogs(rawData) {
  const dataSource = [];
  rawData.forEach(log => {
    dataSource.push({
      key: log.logDataHash,
      num: log.logDataHash,
      // direct: log.is_direct_successful ? "Yes" : "No",
      tcp_hp: log.tcp_hole_punch_result === "Succeeded" ? "Yes" : "Fail",
      udp_hp: log.udp_hole_punch_result === "Succeeded" ? "Yes" : "Fail",
      nat_type: [log.peer_requester.nat_type, log.peer_responder.nat_type],
      os: [log.peer_requester.os, log.peer_responder.os],
      country: [log.peer_requester.geo_info.country_name, log.peer_responder.geo_info.country_name],
      isSuccessful: log.isSuccessful,
      color: (log.tcp_hole_punch_result === "Failed" && log.udp_hole_punch_result === "Failed") ? 'table-row-colour-fail' : 'table-row-colour-success'
    });
  });
  return dataSource
}

class Tables extends Component {
  constructor() {
    super();
    this.state = {
      page: window.pageNo || 1,
    };
  }

  pageChange(page) {
    window.pageNo = page;
    this.setState({
      page: page
    });
  }

  componentWillUpdate(nextProps) {
    if (!isEquivalent(this.props.dropDownFilter, nextProps.dropDownFilter)) {
      window.pageNo = 1;
      this.setState({
        page: 1
      });
    }
  }

  render() {
    const { dataSource } = this.props;
    const filterData = filterLogs(dataSource)
    return (
      <div>
        <Table
          dataSource={filterData}
          columns={columns}
          rowClassName={(record) => record.color}
          pagination={{ onChange: this.pageChange.bind(this), current: this.state.page, hideOnSinglePage: true }}
        />
      </div>
    );
  }
}

export default Tables;

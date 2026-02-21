import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    ownerPrincipal : ?Principal;
  };

  type NewActor = {
    var ownerAdmins : List.List<Principal>;
    var isInitialized : Bool;
  };

  public func run(old : OldActor) : NewActor {
    let ownerAdmins = List.empty<Principal>();
    {
      var ownerAdmins = ownerAdmins;
      var isInitialized = false;
    };
  };
};
